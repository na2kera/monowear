import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { findProduct, imagePath, taxIncluded, yen } from '../data/products'
import {
  getCart, saveCart, getGiftWrap, setGiftWrap, itemsTotal, GIFT_WRAP_PRICE, type CartItem,
} from '../lib/cart'
import styles from './Cart.module.css'

const keyOf = (i: CartItem) => `${i.productId}-${i.color}-${i.size}`

export default function Cart() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>(() => getCart())
  // ANTI-PATTERN #11: プルダウンで選んだ数量は「下書き」として持つだけ。
  // 「数量を更新」を押すまで小計・合計に反映されず、押さずに進むと変更は捨てられる。
  const [draftQty, setDraftQty] = useState<Record<string, number>>({})
  const [gift, setGift] = useState(() => getGiftWrap())

  const remove = (target: CartItem) => {
    // ANTI-PATTERN #12: 確認なしで即削除。取り消しもできない
    const next = items.filter((i) => keyOf(i) !== keyOf(target))
    setItems(next)
    saveCart(next)
  }

  const applyQty = () => {
    const next = items.map((i) => ({ ...i, qty: draftQty[keyOf(i)] ?? i.qty }))
    setItems(next)
    saveCart(next)
    setDraftQty({})
  }

  const toggleGift = (on: boolean) => {
    setGift(on)
    setGiftWrap(on)
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="pageTitle">ショッピングカート</h1>
        <p className={styles.empty}>カートに商品がありません。</p>
        <Link to="/products" className="btnSecondary">
          買い物を続ける
        </Link>
      </div>
    )
  }

  const subtotal = itemsTotal(items)
  const total = subtotal + (gift ? GIFT_WRAP_PRICE : 0)

  return (
    <div className="container">
      <h1 className="pageTitle">ショッピングカート</h1>

      <div className={styles.layout}>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th colSpan={2}>商品</th>
                <th>価格（税込）</th>
                <th>数量</th>
                <th>小計</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const p = findProduct(i.productId)
                if (!p) return null
                const color = p.colors.find((c) => c.slug === i.color)
                const k = keyOf(i)
                return (
                  <tr key={k}>
                    <td className={styles.imageCell}>
                      <img src={imagePath(p.id, i.color, 'front')} alt="" />
                    </td>
                    <td>
                      <Link to={`/products/${p.id}`} className={styles.name}>
                        {p.name}
                      </Link>
                      <p className={styles.variant}>
                        カラー：{color?.name} / サイズ：{i.size}
                      </p>
                    </td>
                    <td>{yen(taxIncluded(p.price))}</td>
                    <td>
                      <select
                        className={`input ${styles.qty}`}
                        value={draftQty[k] ?? i.qty}
                        onChange={(e) => setDraftQty({ ...draftQty, [k]: Number(e.target.value) })}
                      >
                        {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.sub}>{yen(taxIncluded(p.price) * i.qty)}</td>
                    <td>
                      <button className={styles.remove} onClick={() => remove(i)}>
                        削除
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className={styles.under}>
            <button className={styles.update} onClick={applyQty}>
              数量を更新
            </button>
          </div>

          {/* ANTI-PATTERN #13 【ダークパターン】: ギフトラッピング（有料）が最初からチェックされている。小さく目立たない */}
          <label className={styles.gift}>
            <input type="checkbox" checked={gift} onChange={(e) => toggleGift(e.target.checked)} />
            ギフトラッピングを利用する（+{yen(GIFT_WRAP_PRICE)}）
          </label>
        </div>

        <aside className={styles.summary}>
          <dl>
            <dt>商品合計</dt>
            <dd>{yen(subtotal)}</dd>
            {gift && (
              <>
                <dt>オプション</dt>
                <dd>{yen(GIFT_WRAP_PRICE)}</dd>
              </>
            )}
            {/* ANTI-PATTERN #14: 送料はここでは分からない（購入手続きの最後で初めて出る） */}
            <dt>送料</dt>
            <dd className={styles.later}>購入手続き画面で計算されます</dd>
          </dl>
          <div className={styles.total}>
            <span>合計（税込）</span>
            <strong>{yen(total)}</strong>
          </div>
          {/* ANTI-PATTERN #12: 「購入手続きへ」は、各行の「削除」より目立たない */}
          <button className={styles.checkout} onClick={() => navigate('/register')}>
            購入手続きへ
          </button>
          <Link to="/products" className={styles.continue}>
            買い物を続ける
          </Link>
        </aside>
      </div>
    </div>
  )
}
