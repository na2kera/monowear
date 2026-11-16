import { useEffect } from 'react'
import { resetAll } from '../lib/cart'

/** 講師用：/reset を開くと、カート・会員情報などを消してトップへ戻る（参加者向けの導線はない） */
export default function Reset() {
  useEffect(() => {
    resetAll()
    window.location.replace('/')
  }, [])
  return null
}
