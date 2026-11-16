// 商品データ（アプリと画像生成スクリプトの両方が参照する唯一の定義）
// 価格はすべて税抜。画像パスは imagePath() で決まる。

export type Category = 'tops' | 'bottoms' | 'outer' | 'shoes' | 'goods'

export type Cut = 'front' | 'back' | 'detail'

export const CUTS: Cut[] = ['front', 'back', 'detail']

export type ColorVariant = {
  slug: string
  name: string
  hex: string
  /** 画像生成用の英語の色名 */
  en: string
  /** 在庫切れのサイズ。'all' は全サイズ在庫切れ */
  soldOut?: string[] | 'all'
}

export type Product = {
  id: string
  name: string
  category: Category
  price: number
  colors: ColorVariant[]
  sizes: string[]
  description: string
  material: string
  /** 画像生成用の英語の商品説明 */
  en: string
}

export const CATEGORY_LABEL: Record<Category, string> = {
  tops: 'トップス',
  bottoms: 'ボトムス',
  outer: 'アウター',
  shoes: 'シューズ',
  goods: '小物',
}

const CLOTH_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES = [
  '23.0', '23.5', '24.0', '24.5', '25.0', '25.5', '26.0',
  '26.5', '27.0', '27.5', '28.0', '28.5', '29.0',
]

export const products: Product[] = [
  // ---------- トップス ----------
  {
    id: 't01',
    name: 'クルーネックTシャツ',
    category: 'tops',
    price: 1490,
    colors: [
      { slug: 'white', name: 'ホワイト', hex: '#f5f5f2', en: 'white' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
      { slug: 'gray', name: 'グレー', hex: '#9a9a9a', en: 'heather gray' },
    ],
    sizes: CLOTH_SIZES,
    description: '毎日着たくなる、程よい厚みのベーシックなTシャツ。',
    material: '綿100%',
    en: 'plain crew-neck short-sleeve cotton T-shirt',
  },
  {
    id: 't02',
    name: 'オックスフォードシャツ',
    category: 'tops',
    price: 3990,
    colors: [
      { slug: 'white', name: 'ホワイト', hex: '#f5f5f2', en: 'white' },
      { slug: 'blue', name: 'ブルー', hex: '#a9c1dc', en: 'light blue' },
    ],
    sizes: CLOTH_SIZES,
    description: 'きれいめにもカジュアルにも使えるボタンダウンシャツ。',
    material: '綿100%',
    en: 'long-sleeve button-down oxford cotton shirt, buttoned, collar visible',
  },
  {
    id: 't03',
    name: 'ミドルゲージクルーネックニット',
    category: 'tops',
    price: 4990,
    colors: [
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
      { slug: 'oatmeal', name: 'オートミール', hex: '#d9cdb8', en: 'oatmeal beige' },
      { slug: 'green', name: 'グリーン', hex: '#3e5a43', en: 'forest green', soldOut: 'all' },
    ],
    sizes: CLOTH_SIZES,
    description: 'ふっくらとした編み地で、一枚でもさまになるニット。',
    material: 'ウール50% アクリル50%',
    en: 'plain crew-neck wool knit sweater with ribbed cuffs and hem',
  },
  {
    id: 't04',
    name: 'スウェットプルパーカー',
    category: 'tops',
    price: 4490,
    colors: [
      { slug: 'gray', name: 'グレー', hex: '#9a9a9a', en: 'heather gray' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: CLOTH_SIZES,
    description: '裏毛素材でオールシーズン使えるプルオーバーパーカー。',
    material: '綿80% ポリエステル20%',
    en: 'plain pullover sweat hoodie with kangaroo pocket and drawstrings',
  },
  {
    id: 't05',
    name: 'スウェットシャツ',
    category: 'tops',
    price: 3990,
    colors: [
      { slug: 'ecru', name: 'エクリュ', hex: '#ece6d6', en: 'ecru off-white' },
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
    ],
    sizes: CLOTH_SIZES,
    description: 'ゆったりとしたシルエットのクルーネックスウェット。',
    material: '綿80% ポリエステル20%',
    en: 'plain crew-neck sweatshirt with ribbed cuffs and hem',
  },
  {
    id: 't06',
    name: 'ロングスリーブTシャツ',
    category: 'tops',
    price: 1990,
    colors: [
      { slug: 'white', name: 'ホワイト', hex: '#f5f5f2', en: 'white' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: CLOTH_SIZES,
    description: 'インナーにも一枚着にも使える長袖Tシャツ。',
    material: '綿100%',
    en: 'plain crew-neck long-sleeve cotton T-shirt',
  },

  // ---------- ボトムス ----------
  {
    id: 'b01',
    name: 'テーパードパンツ',
    category: 'bottoms',
    price: 3990,
    colors: [
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
      { slug: 'beige', name: 'ベージュ', hex: '#cdb894', en: 'beige' },
    ],
    sizes: CLOTH_SIZES,
    description: '裾に向かって細くなる、すっきり見えるパンツ。',
    material: 'ポリエステル70% レーヨン30%',
    en: 'tapered slacks trousers with center crease',
  },
  {
    id: 'b02',
    name: 'ストレートデニム',
    category: 'bottoms',
    price: 4990,
    colors: [
      { slug: 'indigo', name: 'インディゴ', hex: '#283a5c', en: 'dark indigo', soldOut: 'all' },
      { slug: 'lightblue', name: 'ライトブルー', hex: '#8fa9c8', en: 'light wash blue', soldOut: 'all' },
    ],
    sizes: CLOTH_SIZES,
    description: '流行に左右されない、まっすぐなシルエットのデニム。',
    material: '綿100%',
    en: 'straight-leg five-pocket denim jeans, no visible logo patch',
  },
  {
    id: 'b03',
    name: 'チノパンツ',
    category: 'bottoms',
    price: 3490,
    colors: [
      { slug: 'beige', name: 'ベージュ', hex: '#cdb894', en: 'beige' },
      { slug: 'olive', name: 'オリーブ', hex: '#5f6142', en: 'olive' },
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
    ],
    sizes: CLOTH_SIZES,
    description: '定番のコットンチノ。程よいゆとりのあるシルエット。',
    material: '綿98% ポリウレタン2%',
    en: 'regular-fit cotton chino trousers',
  },
  {
    id: 'b04',
    name: 'ワイドパンツ',
    category: 'bottoms',
    price: 4490,
    colors: [
      { slug: 'charcoal', name: 'チャコール', hex: '#3b3b3d', en: 'charcoal gray' },
      { slug: 'ecru', name: 'エクリュ', hex: '#ece6d6', en: 'ecru off-white' },
    ],
    sizes: CLOTH_SIZES,
    description: 'たっぷりとした身幅で、楽に穿けるワイドパンツ。',
    material: 'ポリエステル100%',
    en: 'wide-leg relaxed trousers with pleats',
  },
  {
    id: 'b05',
    name: 'ショートパンツ',
    category: 'bottoms',
    price: 2490,
    colors: [
      { slug: 'khaki', name: 'カーキ', hex: '#8a7f5a', en: 'khaki' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: CLOTH_SIZES,
    description: '膝上丈のコットンショートパンツ。',
    material: '綿100%',
    en: 'knee-length cotton chino shorts',
  },

  // ---------- アウター ----------
  {
    id: 'o01',
    name: 'ステンカラーコート',
    category: 'outer',
    price: 12990,
    colors: [
      { slug: 'beige', name: 'ベージュ', hex: '#c8b18a', en: 'beige', soldOut: 'all' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black', soldOut: 'all' },
    ],
    sizes: CLOTH_SIZES,
    description: '撥水加工を施した、オンオフ使えるステンカラーコート。',
    material: 'ポリエステル65% 綿35%',
    en: 'knee-length balmacaan coat with hidden button placket',
  },
  {
    id: 'o02',
    name: 'ダウンジャケット',
    category: 'outer',
    price: 9990,
    colors: [
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
      { slug: 'olive', name: 'オリーブ', hex: '#5f6142', en: 'olive' },
    ],
    sizes: CLOTH_SIZES,
    description: '軽くて暖かい、ショート丈のダウンジャケット。',
    material: '表地：ナイロン100% 中綿：ダウン90% フェザー10%',
    en: 'short quilted down puffer jacket with stand collar and zipper',
  },
  {
    id: 'o03',
    name: 'デニムジャケット',
    category: 'outer',
    price: 5990,
    colors: [
      { slug: 'indigo', name: 'インディゴ', hex: '#283a5c', en: 'dark indigo' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: CLOTH_SIZES,
    description: '着込むほどに味が出る、定番のデニムジャケット。',
    material: '綿100%',
    en: 'classic denim trucker jacket with chest pockets and metal buttons',
  },
  {
    id: 'o04',
    name: 'ナイロンブルゾン',
    category: 'outer',
    price: 6990,
    colors: [
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
      { slug: 'khaki', name: 'カーキ', hex: '#8a7f5a', en: 'khaki' },
    ],
    sizes: CLOTH_SIZES,
    description: '軽くて羽織りやすい、撥水ナイロンのブルゾン。',
    material: 'ナイロン100%',
    en: 'lightweight nylon zip-up blouson jacket with ribbed collar and cuffs',
  },

  // ---------- シューズ ----------
  {
    id: 's01',
    name: 'レザースニーカー',
    category: 'shoes',
    price: 6990,
    colors: [
      { slug: 'white', name: 'ホワイト', hex: '#f5f5f2', en: 'white', soldOut: ['26.5', '27.0'] },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: SHOE_SIZES,
    description: 'どんな服にも合わせやすい、シンプルなレザースニーカー。',
    material: 'アッパー：合成皮革 ソール：ラバー',
    en: 'plain low-top leather sneaker with flat cupsole, no logos',
  },
  {
    id: 's02',
    name: 'レザーダービーシューズ',
    category: 'shoes',
    price: 9990,
    colors: [
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
      { slug: 'brown', name: 'ブラウン', hex: '#5a3a24', en: 'dark brown' },
    ],
    sizes: SHOE_SIZES,
    description: 'きちんと感のある外羽根のレザーシューズ。',
    material: 'アッパー：牛革 ソール：ラバー',
    en: 'plain-toe leather derby dress shoe with laces',
  },
  {
    id: 's03',
    name: 'キャンバススリッポン',
    category: 'shoes',
    price: 3990,
    colors: [
      { slug: 'white', name: 'ホワイト', hex: '#f5f5f2', en: 'white' },
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: SHOE_SIZES,
    description: 'さっと履ける、軽いキャンバス地のスリッポン。',
    material: 'アッパー：綿 ソール：ラバー',
    en: 'plain canvas slip-on sneaker with white rubber sole, no logos',
  },
  {
    id: 's04',
    name: 'サイドゴアブーツ',
    category: 'shoes',
    price: 11990,
    colors: [
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
      { slug: 'brown', name: 'ブラウン', hex: '#5a3a24', en: 'dark brown' },
    ],
    sizes: SHOE_SIZES,
    description: '着脱しやすく、雨の日にも使えるサイドゴアブーツ。',
    material: 'アッパー：牛革 ソール：ラバー',
    en: 'ankle-high leather chelsea boot with elastic side panel',
  },

  // ---------- 小物 ----------
  {
    id: 'g01',
    name: 'ベースボールキャップ',
    category: 'goods',
    price: 1990,
    colors: [
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
      { slug: 'beige', name: 'ベージュ', hex: '#cdb894', en: 'beige' },
      { slug: 'navy', name: 'ネイビー', hex: '#22304a', en: 'navy' },
    ],
    sizes: ['FREE'],
    description: 'アジャスター付きで、サイズ調整ができるコットンキャップ。',
    material: '綿100%',
    en: 'plain six-panel cotton baseball cap with curved brim, no logo or embroidery',
  },
  {
    id: 'g02',
    name: 'キャンバストートバッグ',
    category: 'goods',
    price: 2490,
    colors: [
      { slug: 'natural', name: 'ナチュラル', hex: '#e8dfc9', en: 'natural undyed canvas' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: ['FREE'],
    description: 'A4サイズが入る、丈夫な厚手キャンバスのトートバッグ。',
    material: '綿100%',
    en: 'plain heavy canvas tote bag with two shoulder handles, no print',
  },
  {
    id: 'g03',
    name: 'ソックス3足組',
    category: 'goods',
    price: 990,
    colors: [
      { slug: 'white', name: 'ホワイト', hex: '#f5f5f2', en: 'white' },
      { slug: 'black', name: 'ブラック', hex: '#1d1d1d', en: 'black' },
    ],
    sizes: ['23-25cm', '25-27cm'],
    description: 'かかとがずれにくい、3足組のクルー丈ソックス。',
    material: '綿75% ポリエステル23% ポリウレタン2%',
    en: 'set of three plain crew-length cotton socks, no logos',
  },
]

export function imagePath(productId: string, colorSlug: string, cut: Cut): string {
  return `/images/products/${productId}/${colorSlug}-${cut}.jpg`
}

export function findProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id)
}

export function isSoldOut(color: ColorVariant, size: string): boolean {
  if (!color.soldOut) return false
  if (color.soldOut === 'all') return true
  return color.soldOut.includes(size)
}

export function taxIncluded(price: number): number {
  return Math.floor(price * 1.1)
}

export function yen(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`
}
