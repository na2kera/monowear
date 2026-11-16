import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  findProduct, imagePath, isSoldOut, taxIncluded, yen, CATEGORY_LABEL, CUTS, type Cut,
} from '../data/products'
import { addToCart } from '../lib/cart'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const product = findProduct(id)
  const [colorSlug, setColorSlug] = useState(product?.colors[0].slug ?? '')
  const [size, setSize] = useState<string | null>(null)
  const [cut, setCut] = useState<Cut>('front')
  const [error, setError] = useState('')

  if (!product) {
    return (
      <div className="container">
        <p className={styles.notFound}>商品が見つかりませんでした。</p>
      </div>
    )
  }

  const color = product.colors.find((c) => c.slug === colorSlug) ?? product.colors[0]
  const allSoldOut = product.colors.every((c) => c.soldOut === 'all')
  const colorSoldOut = color.soldOut === 'all'

  const selectColor = (slug: string) => {
    setColorSlug(slug)
    // ANTI-PATTERN #7: 色を変えると、選んでいたサイズがリセットされる
    setSize(null)
  }

  const handleAdd = () => {
    if (allSoldOut || colorSoldOut) return
    if (!size) {
      setError('サイズを選択してください')
      return
    }
    setError('')
    // ANTI-PATTERN #9: カートには追加されるが、画面上には何の反応もない。
    // ボタンの見た目も変わらず、メッセージも出ない（ヘッダーの件数も #1 で増えない）。
    addToCart({ productId: product.id, color: color.slug, size })
  }

  return (
    <div className="container">
      <nav className={styles.breadcrumb}>
        <Link to="/">ホーム</Link> / <Link to={`/products?category=${product.category}`}>{CATEGORY_LABEL[product.category]}</Link> /{' '}
        {product.name}
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.thumbs}>
            {CUTS.map((c) => (
              <button
                key={c}
                className={`${styles.thumb} ${c === cut ? styles.thumbActive : ''}`}
                onClick={() => setCut(c)}
              >
                <img src={imagePath(product.id, color.slug, c)} alt="" />
              </button>
            ))}
          </div>
          <div className={styles.main}>
            <img src={imagePath(product.id, color.slug, cut)} alt={`${product.name} ${color.name}`} />
          </div>
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.code}>商品番号：MW-{product.id.toUpperCase()}-{String(product.price).slice(0, 2)}</p>

          {/* ANTI-PATTERN #5: 詳細では税込価格。一覧（税抜）と金額が合わない */}
          <p className={styles.price}>
            {yen(taxIncluded(product.price))}
            <span>（税込）</span>
          </p>

          {/* ANTI-PATTERN #10 【ダークパターン】: どの商品にも「残り2点」。在庫数とは関係なく、リロードしても変わらない */}
          {!allSoldOut && <p className={styles.hurry}>残り2点！ お早めにお買い求めください</p>}

          <div className={styles.section}>
            <p className={styles.label}>
              カラー：<strong>{color.name}</strong>
            </p>
            <div className={styles.colors}>
              {product.colors.map((c) => (
                <button
                  key={c.slug}
                  title={c.name}
                  className={`${styles.color} ${c.slug === color.slug ? styles.colorActive : ''}`}
                  onClick={() => selectColor(c.slug)}
                >
                  <img src={imagePath(product.id, c.slug, 'front')} alt={c.name} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>
              サイズ：<strong>{size ?? '選択してください'}</strong>
              {/* ANTI-PATTERN #8: サイズ表は別タブで開き、cm とインチが混在している */}
              <a href="/size-chart" target="_blank" className={styles.sizeChart}>
                サイズ表
              </a>
            </p>
            <div className={styles.sizes}>
              {product.sizes.map((s) => {
                const soldOut = isSoldOut(color, s)
                return (
                  <button
                    key={s}
                    disabled={soldOut}
                    className={`${styles.size} ${s === size ? styles.sizeActive : ''} ${soldOut ? styles.sizeSoldOut : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {allSoldOut ? (
            <p className={styles.soldOutMsg}>この商品は現在在庫切れです。再入荷の予定はありません。</p>
          ) : colorSoldOut ? (
            <p className={styles.soldOutMsg}>このカラーは在庫切れです。</p>
          ) : null}

          <button
            className={`btnPrimary ${styles.add} ${allSoldOut || colorSoldOut ? styles.addDisabled : ''}`}
            onClick={handleAdd}
          >
            カートに入れる
          </button>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.desc}>
            <h2>商品説明</h2>
            <p>{product.description}</p>
            <h2>素材</h2>
            <p>{product.material}</p>
            <h2>配送・返品について</h2>
            <p>
              ご注文確定後、3〜7営業日以内に発送いたします。配送料は地域・ご注文金額により異なります。返品は商品到着後7日以内、未使用品に限り承ります。返品時の送料はお客様のご負担となります。セール商品は返品・交換をお受けできません。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
