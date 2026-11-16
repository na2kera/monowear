import { useSearchParams } from 'react-router'
import ProductCard from '../components/ProductCard'
import { products, CATEGORY_LABEL, type Category } from '../data/products'
import styles from './ProductList.module.css'

const COLOR_OPTIONS: { slug: string; name: string }[] = []
for (const p of products)
  for (const c of p.colors)
    if (!COLOR_OPTIONS.some((o) => o.name === c.name)) COLOR_OPTIONS.push({ slug: c.slug, name: c.name })

const PRICE_OPTIONS = [
  { value: '0-2999', label: '〜2,999円' },
  { value: '3000-4999', label: '3,000〜4,999円' },
  { value: '5000-9999', label: '5,000〜9,999円' },
  { value: '10000-99999', label: '10,000円〜' },
]

const SORT_OPTIONS = [
  { value: 'recommend', label: 'おすすめ順' },
  { value: 'price-asc', label: '価格の安い順' },
  { value: 'price-desc', label: '価格の高い順' },
]

export default function ProductList() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const color = params.get('color') ?? ''
  const price = params.get('price') ?? ''
  const sort = params.get('sort') ?? 'recommend'

  // ANTI-PATTERN #4: 絞り込みを1つ変えると、その条件だけの URL に置き換える。
  // そのため、ほかの絞り込み条件（と並び順）はリセットされる。
  const update = (key: string, value: string) => {
    setParams(value ? { [key]: value } : {})
  }

  let list = products.filter((p) => !category || p.category === category)
  if (color) {
    const name = COLOR_OPTIONS.find((o) => o.slug === color)?.name
    list = list.filter((p) => p.colors.some((c) => c.name === name))
  }
  if (price) {
    const [min, max] = price.split('-').map(Number)
    list = list.filter((p) => p.price >= min && p.price <= max)
  }
  if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)

  const title = category ? CATEGORY_LABEL[category as Category] : 'すべての商品'

  return (
    <div className="container">
      <h1 className="pageTitle">{title}</h1>

      <div className={styles.filters}>
        <label className={styles.filter}>
          カテゴリ
          <select className="input" value={category} onChange={(e) => update('category', e.target.value)}>
            <option value="">すべて</option>
            {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.filter}>
          カラー
          <select className="input" value={color} onChange={(e) => update('color', e.target.value)}>
            <option value="">すべて</option>
            {COLOR_OPTIONS.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.filter}>
          価格
          <select className="input" value={price} onChange={(e) => update('price', e.target.value)}>
            <option value="">すべて</option>
            {PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className={`${styles.filter} ${styles.sort}`}>
          並び替え
          <select className="input" value={sort} onChange={(e) => update('sort', e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className={styles.count}>{list.length}件</p>

      {list.length === 0 ? (
        <p className={styles.empty}>該当する商品がありません。</p>
      ) : (
        <div className={styles.grid}>
          {list.map((p) => (
            <ProductCard key={p.id} product={p} colorName={COLOR_OPTIONS.find((o) => o.slug === color)?.name} />
          ))}
        </div>
      )}
    </div>
  )
}
