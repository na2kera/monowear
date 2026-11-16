import { Link } from 'react-router'
import CouponModal from '../components/CouponModal'
import HeroCarousel from '../components/HeroCarousel'
import ProductCard from '../components/ProductCard'
import { products, imagePath, CATEGORY_LABEL, type Category } from '../data/products'
import styles from './Home.module.css'

const NEW_ARRIVALS = ['t03', 'o02', 's01', 'b04', 't04', 'o01', 'b02', 'g02']
const CATEGORY_COVER: Record<Category, [string, string]> = {
  tops: ['t02', 'blue'],
  bottoms: ['b03', 'beige'],
  outer: ['o03', 'indigo'],
  shoes: ['s02', 'brown'],
  goods: ['g01', 'navy'],
}

export default function Home() {
  const newItems = NEW_ARRIVALS.map((id) => products.find((p) => p.id === id)!)

  return (
    <>
      <CouponModal />
      <HeroCarousel />

      <section className="container">
        <h2 className={styles.heading}>NEW ARRIVALS</h2>
        <div className={styles.grid}>
          {newItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container">
        <h2 className={styles.heading}>CATEGORY</h2>
        <div className={styles.categories}>
          {(Object.keys(CATEGORY_COVER) as Category[]).map((c) => {
            const [id, color] = CATEGORY_COVER[c]
            return (
              <Link key={c} to={`/products?category=${c}`} className={styles.category}>
                <img src={imagePath(id, color, 'front')} alt="" loading="lazy" />
                <span>{CATEGORY_LABEL[c]}</span>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
