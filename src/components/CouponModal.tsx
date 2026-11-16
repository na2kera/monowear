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
        <p className={styles.text}>メールアドレスを登録すると、次回のお買い物で使えるクーポンをお送りします。</p>
        <input
          className="input"
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className={`btnPrimary ${styles.submit}`}
          onClick={() => {
            if (!email) {
              setMessage('メールアドレスを入力してください。')
              return
            }
            // クーポンはこのサイトでは使えない。探し回らないよう「次回以降」と明示して閉じる
            setMessage('ご登録ありがとうございます。クーポンは次回以降のご注文でご利用いただけます。')
            setTimeout(() => setOpen(false), 1800)
          }}
        >
          クーポンを受け取る
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  )
}
