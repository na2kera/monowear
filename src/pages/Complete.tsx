import { Link } from 'react-router'
import styles from './Complete.module.css'

// ANTI-PATTERN #20: お礼の一文だけ。注文番号も、何をいくらで買ったのかも、いつ届くのかも分からない
export default function Complete() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>ご注文ありがとうございました。</h1>
      <Link to="/" className="btnSecondary">
        トップへ戻る
      </Link>
    </div>
  )
}
