import { Routes, Route, Outlet } from 'react-router'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import Home from './pages/Home.tsx'
import ProductList from './pages/ProductList.tsx'
import ProductDetail from './pages/ProductDetail.tsx'
import SizeChart from './pages/SizeChart.tsx'
import Cart from './pages/Cart.tsx'
import Register from './pages/Register.tsx'
import Checkout from './pages/Checkout.tsx'
import Complete from './pages/Complete.tsx'
import Reset from './pages/Reset.tsx'

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="complete" element={<Complete />} />
          <Route path="*" element={<Home />} />
        </Route>
        {/* サイズ表は別タブで開く単独ページ（ANTI-PATTERN #8） */}
        <Route path="size-chart" element={<SizeChart />} />
        <Route path="reset" element={<Reset />} />
      </Routes>
    </>
  )
}
