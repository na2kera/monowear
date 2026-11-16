import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** 画面遷移のたびにページ先頭へスクロールする（これは意図した悪さではない） */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
