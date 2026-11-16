import { useState } from 'react'
import styles from './CouponModal.module.css'

// ANTI-PATTERN #2: トップを開くたびにクーポンのモーダルが出る。
// 閉じる「×」は小さく薄い。背景クリックや Esc キーでは閉じない。
export default function CouponModal() {
  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  if (!open) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.close} onClick={() => setOpen(false)} aria-label="閉じる">
          ×
        </button>
        <p className={styles.lead}>WELCOME TO MONOWEAR</p>
        <h2 className={styles.title}>
          初回限定
          <br />
          <span>10%OFF</span> クーポン
        </h2>
        <p className={styles.text}>メールアドレスを登録すると、今すぐ使えるクーポンをお送りします。</p>
        <input
          className="input"
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className={`btnPrimary ${styles.submit}`}
          onClick={() =>
            setMessage(email ? 'ご登録ありがとうございます。クーポンはメールでお送りします。' : 'メールアドレスを入力してください。')
          }
        >
          クーポンを受け取る
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  )
}
