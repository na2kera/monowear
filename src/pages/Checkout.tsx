import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { findProduct, imagePath, yen } from '../data/products'
import {
  getCart, getGiftWrap, itemsTotal, shippingFee, clearCart, GIFT_WRAP_PRICE,
} from '../lib/cart'
import { getMember } from '../lib/member'
import styles from './Checkout.module.css'

const PREFS = '北海道,青森県,岩手県,宮城県,秋田県,山形県,福島県,茨城県,栃木県,群馬県,埼玉県,千葉県,東京都,神奈川県,新潟県,富山県,石川県,福井県,山梨県,長野県,岐阜県,静岡県,愛知県,三重県,滋賀県,京都府,大阪府,兵庫県,奈良県,和歌山県,鳥取県,島根県,岡山県,広島県,山口県,徳島県,香川県,愛媛県,高知県,福岡県,佐賀県,長崎県,熊本県,大分県,宮崎県,鹿児島県,沖縄県'.split(',')

const COD_FEE = 330
const HALF_WIDTH = /[\x20-\x7E]/
const DIGITS = /^[0-9]+$/

function deliveryDates() {
  const list: string[] = []
  const d = new Date()
  d.setDate(d.getDate() + 4)
  for (let i = 0; i < 10; i++) {
    list.push(`${d.getMonth() + 1}月${d.getDate()}日`)
    d.setDate(d.getDate() + 1)
  }
  return list
}

export default function Checkout() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isGuest = params.get('guest') === '1'
  const member = isGuest ? null : getMember()
  const [items] = useState(() => getCart())
  const [gift] = useState(() => getGiftWrap())
  const [payment, setPayment] = useState('card')
  const [errors, setErrors] = useState<string[]>([])

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="pageTitle">ご購入手続き</h1>
        <p>カートに商品がありません。</p>
        <Link to="/products" className="btnSecondary">
          商品一覧へ
        </Link>
      </div>
    )
  }

  const subtotal = itemsTotal(items)
  const shipping = shippingFee(items)
  const total = subtotal + (gift ? GIFT_WRAP_PRICE : 0) + shipping + (payment === 'cod' ? COD_FEE : 0)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    const errs = new Set<string>()

    const required = ['lastName', 'firstName', 'zip', 'pref', 'city', 'street', 'tel1', 'tel2', 'tel3']
    if (isGuest || !member) required.push('email')
    if (payment === 'card') required.push('cardNumber', 'cardMonth', 'cardYear', 'cardCvc', 'cardName')
    if (required.some((k) => !v(k))) errs.add('必須項目が入力されていません。')

    // ANTI-PATTERN #18: 欄ごとに「全角」「半角」の指定がバラバラ。自動変換もしない
    if ((v('lastName') + v('firstName')).match(HALF_WIDTH)) errs.add('全角で入力してください。')
    if (v('zip') && !/^[0-9]{7}$/.test(v('zip'))) errs.add('半角数字で入力してください。')
    if ((v('city') + v('street')).match(HALF_WIDTH)) errs.add('全角で入力してください。')
    for (const k of ['tel1', 'tel2', 'tel3']) if (v(k) && !DIGITS.test(v(k))) errs.add('半角数字で入力してください。')
    if (v('email') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) errs.add('正しい形式で入力してください。')
    if (payment === 'card') {
      if (v('cardNumber') && !/^[0-9]{16}$/.test(v('cardNumber'))) errs.add('半角数字で入力してください。')
      if (v('cardCvc') && !/^[0-9]{3,4}$/.test(v('cardCvc'))) errs.add('正しい形式で入力してください。')
      if (v('cardName') && !/^[A-Z ]+$/.test(v('cardName'))) errs.add('半角英大文字で入力してください。')
    }

    if (errs.size > 0) {
      // ANTI-PATTERN #19: エラーはページ上部にまとめて出すだけ。どの欄の話なのかは書かず、欄の強調表示もしない
      setErrors([...errs])
      window.scrollTo(0, 0)
      return
    }

    clearCart()
    try {
      localStorage.removeItem('monowear.giftWrap')
    } catch {
      // 何もしない
    }
    navigate('/complete')
  }

  return (
    <div className="container">
      <h1 className="pageTitle">ご購入手続き</h1>

      {errors.length > 0 && (
        <div className={styles.errors}>
          <p>入力内容に誤りがあります。（エラーコード：E-1032）</p>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form className={styles.layout} onSubmit={submit} noValidate>
        <div>
          <section className={styles.section}>
            <h2>お届け先</h2>
            <div className={styles.row}>
              <span className={styles.label}>氏名</span>
              <div>
                <div className={styles.pair}>
                  <input className="input" name="lastName" placeholder="姓" defaultValue={member?.lastName} />
                  <input className="input" name="firstName" placeholder="名" defaultValue={member?.firstName} />
                </div>
                <p className={styles.hint}>※全角で入力</p>
              </div>
            </div>
            {(isGuest || !member) && (
              <div className={styles.row}>
                <span className={styles.label}>メールアドレス</span>
                <div>
                  <input className="input" name="email" type="email" />
                  <p className={styles.hint}>※半角英数字</p>
                </div>
              </div>
            )}
            <div className={styles.row}>
              <span className={styles.label}>郵便番号</span>
              <div>
                <input className={`input ${styles.short}`} name="zip" placeholder="1234567" />
                <p className={styles.hint}>※半角数字7桁（ハイフンなし）</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>都道府県</span>
              <select className={`input ${styles.short}`} name="pref" defaultValue="">
                <option value="">選択してください</option>
                {PREFS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>市区町村</span>
              <div>
                <input className="input" name="city" />
                <p className={styles.hint}>※全角で入力</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>番地・建物名</span>
              <div>
                <input className="input" name="street" />
                <p className={styles.hint}>※番地も全角で入力してください（例：１－２－３）</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>電話番号</span>
              <div>
                <div className={styles.tel}>
                  <input className="input" name="tel1" maxLength={4} />－
                  <input className="input" name="tel2" maxLength={4} />－
                  <input className="input" name="tel3" maxLength={4} />
                </div>
                <p className={styles.hint}>※半角数字</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>お届け希望日</span>
              <select className={`input ${styles.short}`} name="date" defaultValue="">
                <option value="">指定なし</option>
                {deliveryDates().map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </section>

          <section className={styles.section}>
            <h2>お支払い方法</h2>
            <div className={styles.payments}>
              <label>
                <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} /> クレジットカード
              </label>
              <label>
                <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> 代金引換（手数料 {yen(COD_FEE)}）
              </label>
              <label>
                <input type="radio" name="payment" checked={payment === 'cvs'} onChange={() => setPayment('cvs')} /> コンビニ払い
              </label>
            </div>

            {payment === 'card' && (
              <div className={styles.card}>
                <p className={styles.fake}>
                  ※ワークショップ用の架空サイトです。実在のカード番号は入力しないでください（例：4242424242424242）。
                </p>
                <div className={styles.row}>
                  <span className={styles.label}>カード番号</span>
                  <div>
                    <input className="input" name="cardNumber" />
                    <p className={styles.hint}>※半角数字16桁（スペース・ハイフンなし）</p>
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>有効期限</span>
                  <div className={styles.expiry}>
                    <select className="input" name="cardMonth" defaultValue="">
                      <option value="">月</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i}>{String(i + 1).padStart(2, '0')}</option>
                      ))}
                    </select>
                    /
                    <select className="input" name="cardYear" defaultValue="">
                      <option value="">年</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i}>{new Date().getFullYear() + i}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>セキュリティコード</span>
                  <input className={`input ${styles.short}`} name="cardCvc" />
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>カード名義</span>
                  <div>
                    <input className="input" name="cardName" placeholder="TARO MONO" />
                    <p className={styles.hint}>※半角英大文字</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className={styles.summary}>
          <h2>ご注文内容</h2>
          <ul className={styles.items}>
            {items.map((i) => {
              const p = findProduct(i.productId)
              if (!p) return null
              return (
                <li key={`${i.productId}-${i.color}-${i.size}`}>
                  <img src={imagePath(p.id, i.color, 'front')} alt="" />
                  <div>
                    <p>{p.name}</p>
                    <p className={styles.variant}>
                      {p.colors.find((c) => c.slug === i.color)?.name} / {i.size} / {i.qty}点
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
          <dl>
            <dt>商品合計</dt>
            <dd>{yen(subtotal)}</dd>
            {gift && (
              <>
                <dt>ギフトラッピング</dt>
                <dd>{yen(GIFT_WRAP_PRICE)}</dd>
              </>
            )}
            {/* ANTI-PATTERN #14: 送料はここで初めて表示される */}
            <dt>送料</dt>
            <dd>{shipping === 0 ? '無料' : yen(shipping)}</dd>
            {payment === 'cod' && (
              <>
                <dt>代引手数料</dt>
                <dd>{yen(COD_FEE)}</dd>
              </>
            )}
          </dl>
          <div className={styles.total}>
            <span>お支払い合計（税込）</span>
            <strong>{yen(total)}</strong>
          </div>
          <button type="submit" className={`btnPrimary ${styles.submit}`}>
            注文を確定する
          </button>
        </aside>
      </form>
    </div>
  )
}
