import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.logo}>MONOWEAR</div>
        <ul className={styles.info}>
          <li>営業時間 10:00〜18:00（土日祝を除く）</li>
          <li>ご注文後のキャンセル・変更はお受けできません</li>
          <li>返品は商品到着後7日以内、未使用品に限ります（送料はお客様負担）</li>
        </ul>
        <p className={styles.disclaimer}>
          このサイトはワークショップ用の架空のショップです。実際の注文・決済は行われません。実在のカード番号や個人情報は入力しないでください。
        </p>
        <p className={styles.copy}>© MONOWEAR</p>
      </div>
    </footer>
  )
}
