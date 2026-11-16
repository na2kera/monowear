import { useState } from 'react'
import { Link } from 'react-router'
import { cartCount } from '../lib/cart'
import { getMember } from '../lib/member'
import { CATEGORY_LABEL, type Category } from '../data/products'
import styles from './Header.module.css'

const NAV: Category[] = ['tops', 'bottoms', 'outer', 'shoes', 'goods']

export default function Header() {
  // ANTI-PATTERN #1: カート件数は最初に表示したときに一度だけ読む。
  // ヘッダーはページを移動しても作り直されないので、リロードするまで件数が古いまま。
  const [count] = useState(() => cartCount())
  const member = getMember()

  return (
    <header className={styles.header}>
      <div className={styles.notice}>WINTER COLLECTION 新作アイテム入荷中</div>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          MONOWEAR
        </Link>
        <nav className={styles.nav}>
          <Link to="/products">すべて</Link>
          {NAV.map((c) => (
            <Link key={c} to={`/products?category=${c}`}>
              {CATEGORY_LABEL[c]}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          {member ? <span>{member.lastName} 様</span> : <Link to="/register">会員登録</Link>}
          <Link to="/cart" className={styles.cart}>
            カート
            <span className={styles.badge}>{count}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
