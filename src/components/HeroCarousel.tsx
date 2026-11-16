import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import styles from './HeroCarousel.module.css'

const SLIDES = [
  { img: '/images/kv/kv-1.jpg', label: 'NEW SEASON', title: 'BASIC KNIT & TEE', to: '/products?category=tops' },
  { img: '/images/kv/kv-2.jpg', label: 'COLLECTION', title: 'OUTERWEAR', to: '/products?category=outer' },
  { img: '/images/kv/kv-3.jpg', label: 'FEATURE', title: 'EVERYDAY SNEAKERS', to: '/products?category=shoes' },
  { img: '/images/kv/kv-4.jpg', label: 'PICK UP', title: 'BOTTOMS SELECTION', to: '/products?category=bottoms' },
]

// ANTI-PATTERN #3: 2.5秒ごとに自動で切り替わり、止められない。
// ホバーしても止まらず、前後ボタンもない。下のドットは飾りで、押しても何も起きない。
// 読もうとしているうちに切り替わり、押した瞬間に別のスライドのリンクへ飛ぶことがある。
export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 2500)
    return () => clearInterval(id)
  }, [])

  const slide = SLIDES[index]

  return (
    <div className={styles.hero}>
      <Link to={slide.to} className={styles.link}>
      {SLIDES.map((s, i) => (
        <img
          key={s.img}
          src={s.img}
          alt=""
          className={`${styles.image} ${i === index ? styles.active : ''}`}
        />
      ))}
      <div className={styles.text}>
        <p className={styles.label}>{slide.label}</p>
        <h2 className={styles.title}>{slide.title}</h2>
        <span className={styles.more}>VIEW MORE →</span>
      </div>
      </Link>
      {/* ドットは Link の外にある飾り。押せそうに見えるが何も起きない */}
      <div className={styles.dots}>
        {SLIDES.map((s, i) => (
          <span key={s.img} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
        ))}
      </div>
    </div>
  )
}
