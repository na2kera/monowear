// 商品画像を Codex (codex exec の image_generation) で生成し、JPEG に縮小して public/ に配置する。
// 使い方: node scripts/generate-images.ts [--concurrency 4] [--only t01,t02] [--convert-only]
// - 生成済みのファイルはスキップする（再実行で途中から再開できる）
// - 元の PNG は .raw-images/ に残す（git 管理外）

import { spawn, execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, createWriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { products, CUTS, type Product, type Cut } from '../src/data/products.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const RAW = join(ROOT, '.raw-images')
const OUT = join(ROOT, 'public', 'images')

const args = process.argv.slice(2)
const argValue = (name: string) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const concurrency = Number(argValue('--concurrency') ?? 4)
const only = argValue('--only')?.split(',')
const convertOnly = args.includes('--convert-only')

const STYLE = `Style rules (identical for every image so they look like one shop's catalog):
pure white seamless background (#FFFFFF), soft even studio lighting, very subtle soft shadow under the item,
photorealistic e-commerce product photography, portrait 2:3 aspect ratio at 1024x1536,
no people, no model, no hands, no text, no letters, no logos, no brand marks, no labels with writing, no watermarks.`

function cutDescription(p: Product, cut: Cut): string {
  const tight =
    'tight macro close-up crop that fills the whole frame edge to edge with the item (no empty white area)'
  switch (p.category) {
    case 'tops':
    case 'outer':
      return {
        front: 'ghost mannequin style, front view, whole garment visible and centered',
        back: 'ghost mannequin style, back view, whole garment visible and centered',
        detail: `${tight}, showing the collar/neckline area and fabric texture`,
      }[cut]
    case 'bottoms':
      return {
        front: 'ghost mannequin style, front view, whole garment from waistband to hem visible and centered',
        back: 'ghost mannequin style, back view showing back pockets, whole garment visible and centered',
        detail: `${tight}, showing the waistband, button/closure and fabric texture`,
      }[cut]
    case 'shoes':
      return {
        front: 'single shoe, side profile view with the toe pointing left, centered',
        back: 'a pair of shoes placed side by side, three-quarter front angle view, centered',
        detail: `${tight}, showing the material texture and stitching of the shoe upper`,
      }[cut]
    case 'goods':
      if (p.id === 'g01')
        return {
          front: 'front view of the cap, centered',
          back: 'back view of the cap showing the adjustable strap, centered',
          detail: `${tight}, showing the brim stitching and cotton twill texture`,
        }[cut]
      if (p.id === 'g02')
        return {
          front: 'front view of the tote bag standing upright with handles up, centered',
          back: 'three-quarter angle view of the tote bag standing upright, centered',
          detail: `${tight}, showing the handle stitching and canvas texture`,
        }[cut]
      return {
        front: 'the three socks laid flat side by side, viewed from directly above, centered',
        back: 'the three socks neatly folded and stacked, centered',
        detail: `${tight}, showing the knit texture and ribbed cuff`,
      }[cut]
  }
}

function rawFile(p: Product, color: string, cut: Cut) {
  return join(RAW, p.id, `${color}-${cut}.png`)
}

function missingFiles(p: Product) {
  const list: { color: Product['colors'][number]; cut: Cut }[] = []
  for (const cut of CUTS)
    for (const color of p.colors) if (!existsSync(rawFile(p, color.slug, cut))) list.push({ color, cut })
  return list
}

function buildPrompt(p: Product) {
  const missing = missingFiles(p)
  const lines = missing.map(
    ({ color, cut }, i) =>
      `${i + 1}. ${color.slug}-${cut}.png : ${color.en} ${p.en}; ${cutDescription(p, cut)}`,
  )
  return `Use your image generation tool to create product photos for a fictional unisex fast-fashion e-commerce shop.
Save each image as PNG in the current directory with EXACTLY the filename given. Do not create any other files.

Product: ${p.en}
All images of this product must show the identical item design (same cut, proportions, stitching and details).
Only the color changes between color variants, and only the viewpoint changes between cuts.
If existing PNG files of this product are already in the current directory, look at them first and match that design.
Generate in the listed order. If your image tool accepts reference images, use the first front image as the reference.

${STYLE}

Images to create:
${lines.join('\n')}

After saving, list the files you created with their pixel dimensions.`
}

function runCodex(cwd: string, prompt: string, logName: string): Promise<number> {
  mkdirSync(join(RAW, 'logs'), { recursive: true })
  const log = createWriteStream(join(RAW, 'logs', `${logName}.log`), { flags: 'a' })
  log.write(`\n===== ${new Date().toISOString()} =====\n`)
  return new Promise((resolve) => {
    const child = spawn(
      'codex',
      ['exec', '--skip-git-repo-check', '--sandbox', 'workspace-write', '-C', cwd, prompt],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    )
    child.stdout.pipe(log, { end: false })
    child.stderr.pipe(log, { end: false })
    child.on('close', (code) => {
      log.end(`\n===== exit ${code} =====\n`)
      resolve(code ?? 1)
    })
  })
}

function convert(src: string, dest: string, maxEdge: number) {
  if (!existsSync(src)) return false
  mkdirSync(dirname(dest), { recursive: true })
  execFileSync('sips', [
    '-Z', String(maxEdge),
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', '78',
    src, '--out', dest,
  ], { stdio: 'ignore' })
  return true
}

function convertProduct(p: Product) {
  let n = 0
  for (const color of p.colors)
    for (const cut of CUTS) {
      const dest = join(OUT, 'products', p.id, `${color.slug}-${cut}.jpg`)
      if (convert(rawFile(p, color.slug, cut), dest, 1200)) n++
    }
  return n
}

// ---------- キービジュアル ----------
const KV = [
  { file: 'kv-1.png', desc: 'minimal still life of neatly folded basic T-shirts and knit sweaters in white, gray and navy stacked on a light wooden table, soft daylight' },
  { file: 'kv-2.png', desc: 'minimal still life of a beige trench-style coat hanging on a simple wooden hanger against a warm off-white wall, soft daylight' },
  { file: 'kv-3.png', desc: 'minimal still life of white leather sneakers and a canvas tote bag on a light concrete floor, soft daylight' },
  { file: 'kv-4.png', desc: 'minimal still life of folded denim jeans, chino trousers and a baseball cap arranged on a light linen surface, viewed from above, soft daylight' },
]

async function generateKv() {
  const dir = join(RAW, 'kv')
  mkdirSync(dir, { recursive: true })
  const missing = KV.filter((k) => !existsSync(join(dir, k.file)))
  if (missing.length > 0) {
    const prompt = `Use your image generation tool to create hero banner photos for the top page of a fictional minimal fast-fashion e-commerce shop.
Save each as PNG in the current directory with EXACTLY the filename given. Do not create any other files.
Style: landscape 3:2 at 1536x1024, photorealistic, calm neutral palette, generous empty space on the left side for overlay text,
no people, no text, no letters, no logos, no brand marks, no watermarks. All images must share one consistent mood.

${missing.map((k, i) => `${i + 1}. ${k.file} : ${k.desc}`).join('\n')}

After saving, list the files you created with their pixel dimensions.`
    console.log(`[kv] generating ${missing.length} images`)
    await runCodex(dir, prompt, 'kv')
  }
  let n = 0
  for (const k of KV)
    if (convert(join(dir, k.file), join(OUT, 'kv', k.file.replace('.png', '.jpg')), 1600)) n++
  console.log(`[kv] converted ${n}/${KV.length}`)
}

// ---------- main ----------
async function processProduct(p: Product) {
  const dir = join(RAW, p.id)
  mkdirSync(dir, { recursive: true })
  if (!convertOnly) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const missing = missingFiles(p)
      if (missing.length === 0) break
      console.log(`[${p.id}] attempt ${attempt}: generating ${missing.length} images`)
      const code = await runCodex(dir, buildPrompt(p), p.id)
      if (code !== 0) console.log(`[${p.id}] codex exited with ${code}`)
    }
  }
  const total = p.colors.length * CUTS.length
  const n = convertProduct(p)
  const left = missingFiles(p).length
  console.log(`[${p.id}] done: converted ${n}/${total}${left ? `, MISSING ${left}` : ''}`)
}

async function main() {
  const targets = products.filter((p) => !only || only.includes(p.id))
  const queue: (() => Promise<void>)[] = targets.map((p) => () => processProduct(p))
  if (!only || only.includes('kv')) queue.unshift(() => generateKv())
  let next = 0
  const workers = Array.from({ length: concurrency }, async () => {
    while (next < queue.length) {
      const job = queue[next++]
      await job()
    }
  })
  await Promise.all(workers)
  console.log('all done')
}

main()
