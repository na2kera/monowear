import { Link } from 'react-router'
import { imagePath, yen, type Product } from '../data/products'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, colorName }: { product: Product; colorName?: string }) {
  // カラーで絞り込んでいるときは、その色の画像を出す
  const first = product.colors.find((c) => c.name === colorName) ?? product.colors[0]
  return (
    // ANTI-PATTERN #6: 在庫切れの商品も、在庫がある商品とまったく同じ見た目で並ぶ
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={imagePath(product.id, first.slug, 'front')}
          alt={product.name}
          loading="lazy"
          className={styles.image}
        />
      </div>
      <div className={styles.swatches}>
        {product.colors.map((c) => (
          <span key={c.slug} className={styles.swatch} style={{ background: c.hex }} />
        ))}
      </div>
      <div className={styles.name}>{product.name}</div>
      {/* ANTI-PATTERN #5: 一覧は税抜価格。「+税」は小さく薄い。詳細画面は税込なので金額が合わない */}
      <div className={styles.price}>
        {yen(product.price)}
        <span className={styles.tax}>+税</span>
      </div>
    </Link>
  )
}
