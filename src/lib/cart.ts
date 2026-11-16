// カートなどの状態は localStorage に保存する（バックエンドなし）。
// あえて「購読（subscribe）」の仕組みを持たせていない。読む側はその時点の値を一度読むだけ。
// → ANTI-PATTERN #1 の前提（ヘッダーのカート件数がリロードするまで更新されない）

import { findProduct, taxIncluded } from '../data/products'

export type CartItem = {
  productId: string
  color: string
  size: string
  qty: number
}

const CART_KEY = 'monowear.cart'
const GIFT_KEY = 'monowear.giftWrap'

export const GIFT_WRAP_PRICE = 550
export const SHIPPING_FEE = 800
/** 送料無料になる商品合計（税込）。購入手続き画面まで出てこない */
export const FREE_SHIPPING_THRESHOLD = 11000

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 保存できなくても画面は動くようにする
  }
}

export function getCart(): CartItem[] {
  return read<CartItem[]>(CART_KEY, [])
}

export function saveCart(items: CartItem[]) {
  write(CART_KEY, items)
}

export function addToCart(item: Omit<CartItem, 'qty'>) {
  const items = getCart()
  const same = items.find(
    (i) => i.productId === item.productId && i.color === item.color && i.size === item.size,
  )
  if (same) same.qty += 1
  else items.push({ ...item, qty: 1 })
  saveCart(items)
}

export function cartCount(): number {
  return getCart().reduce((sum, i) => sum + i.qty, 0)
}

export function clearCart() {
  saveCart([])
}

/** ANTI-PATTERN #13: ギフトラッピングは未設定なら「あり」扱い（最初から追加されている） */
export function getGiftWrap(): boolean {
  return read<boolean>(GIFT_KEY, true)
}

export function setGiftWrap(on: boolean) {
  write(GIFT_KEY, on)
}

/** 商品合計（税込） */
export function itemsTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => {
    const p = findProduct(i.productId)
    return p ? sum + taxIncluded(p.price) * i.qty : sum
  }, 0)
}

export function shippingFee(items: CartItem[]): number {
  return itemsTotal(items) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}
