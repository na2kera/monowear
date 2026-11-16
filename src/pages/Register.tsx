import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { saveMember } from '../lib/member'
import styles from './Register.module.css'

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/
const KATAKANA = /^[ァ-ヶー　]+$/

const YEARS = Array.from({ length: 80 }, (_, i) => 2012 - i)

export default function Register() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])
  // ANTI-PATTERN #16: エラーが出るたびにフォームを作り直すため、入力した内容が全部消える
  const [formKey, setFormKey] = useState(0)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) ?? '').trim()

    const errs: string[] = []
    const required = ['lastName', 'firstName', 'lastKana', 'firstKana', 'email', 'email2', 'password', 'password2', 'year', 'month', 'day', 'gender']
    if (required.some((k) => !v(k))) errs.push('必須項目が入力されていません。')
    if (v('lastKana') && !KATAKANA.test(v('lastKana') + v('firstKana'))) errs.push('フリガナは全角カタカナで入力してください。')
    if (v('email') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) errs.push('メールアドレスの形式が正しくありません。')
    if (v('email') && v('email') !== v('email2')) errs.push('メールアドレスが一致しません。')
    // ANTI-PATTERN #16: パスワードの条件は、送信して失敗するまでどこにも書かれていない
    if (v('password') && !PASSWORD_RULE.test(v('password')))
      errs.push('パスワードは英大文字・英小文字・数字・記号をそれぞれ1文字以上含む8〜20文字で入力してください。')
    if (v('password') && v('password') !== v('password2')) errs.push('パスワードが一致しません。')
    if (!f.get('agree')) errs.push('利用規約に同意してください。')

    if (errs.length > 0) {
      setErrors(errs)
      setFormKey((k) => k + 1)
      window.scrollTo(0, 0)
      return
    }
    saveMember({ lastName: v('lastName'), firstName: v('firstName'), email: v('email') })
    navigate('/checkout')
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className="pageTitle">会員登録</h1>
      <p className={styles.lead}>ご購入には会員登録が必要です。以下の項目をすべてご入力ください。</p>

      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <form key={formKey} onSubmit={submit} className={styles.form} noValidate>
        <div className={styles.row}>
          <span className={styles.label}>氏名<em>必須</em></span>
          <div className={styles.pair}>
            <input className="input" name="lastName" placeholder="姓" />
            <input className="input" name="firstName" placeholder="名" />
          </div>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>フリガナ<em>必須</em></span>
          <div className={styles.pair}>
            <input className="input" name="lastKana" placeholder="セイ" />
            <input className="input" name="firstKana" placeholder="メイ" />
          </div>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>メールアドレス<em>必須</em></span>
          <input className="input" name="email" type="email" />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>メールアドレス（確認）<em>必須</em></span>
          <input className="input" name="email2" type="email" />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>パスワード<em>必須</em></span>
          <input className="input" name="password" type="password" />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>パスワード（確認）<em>必須</em></span>
          <input className="input" name="password2" type="password" />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>生年月日<em>必須</em></span>
          <div className={styles.birth}>
            <select className="input" name="year" defaultValue="">
              <option value="">----</option>
              {YEARS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            年
            <select className="input" name="month" defaultValue="">
              <option value="">--</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
            月
            <select className="input" name="day" defaultValue="">
              <option value="">--</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
            日
          </div>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>性別<em>必須</em></span>
          <div className={styles.radios}>
            <label><input type="radio" name="gender" value="male" /> 男性</label>
            <label><input type="radio" name="gender" value="female" /> 女性</label>
            <label><input type="radio" name="gender" value="other" /> 回答しない</label>
          </div>
        </div>

        <div className={styles.terms}>
          <h2>利用規約</h2>
          <div className={styles.termsBox}>
            <p>第1条（適用）本規約は、MONOWEAR（以下「当ショップ」）が提供するオンラインストアの利用に関する条件を定めるものです。</p>
            <p>第2条（会員登録）登録希望者が当ショップの定める方法によって会員登録を申請し、当ショップがこれを承認することによって、会員登録が完了するものとします。</p>
            <p>第3条（パスワードおよびメールアドレスの管理）会員は、自己の責任において、パスワードおよびメールアドレスを適切に管理するものとします。</p>
            <p>第4条（禁止事項）会員は、法令または公序良俗に違反する行為、犯罪行為に関連する行為、その他当ショップが不適切と判断する行為をしてはなりません。</p>
            <p>第5条（個人情報の取り扱い）当ショップは、会員の個人情報を、商品の発送、サービスのご案内、当ショップおよび提携企業からのお知らせの送付のために利用します。</p>
            <p>第6条（返品）返品は商品到着後7日以内、未使用品に限り承ります。返品時の送料はお客様のご負担となります。</p>
            <p>第7条（免責）当ショップは、当ショップの責に帰すべき事由がある場合を除き、会員に生じた損害について一切の責任を負いません。</p>
            <p>第8条（規約の変更）当ショップは、必要と判断した場合には、会員に通知することなくいつでも本規約を変更することができるものとします。</p>
          </div>
          <label className={styles.agree}>
            <input type="checkbox" name="agree" /> 利用規約に同意する
          </label>

          {/* ANTI-PATTERN #17 【ダークパターン】: メルマガ類が最初から全部 ON。利用規約の下に小さく埋もれている */}
          <div className={styles.mail}>
            <label><input type="checkbox" name="mail1" defaultChecked /> MONOWEARからのお得な情報をメールで受け取る</label>
            <label><input type="checkbox" name="mail2" defaultChecked /> 提携企業からのお知らせをメールで受け取る</label>
            <label><input type="checkbox" name="mail3" defaultChecked /> SMSでキャンペーン情報を受け取る</label>
          </div>
        </div>

        <div className={styles.submitArea}>
          <button type="submit" className="btnPrimary">
            同意して会員登録する
          </button>
        </div>
      </form>

      {/* ANTI-PATTERN #15 【ダークパターン】: 「登録せずに購入」はページ最下部に極小のグレー文字で置かれている */}
      <div className={styles.guest}>
        <Link to="/checkout?guest=1">会員登録せずに購入する</Link>
      </div>
    </div>
  )
}
