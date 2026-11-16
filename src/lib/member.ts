// 会員情報（localStorage に保存するだけ。送信はしない）
export type Member = {
  lastName: string
  firstName: string
  email: string
}

const KEY = 'monowear.member'

export function getMember(): Member | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Member) : null
  } catch {
    return null
  }
}

export function saveMember(m: Member) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m))
  } catch {
    // 保存できなくても先に進めるようにする
  }
}
