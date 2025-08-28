import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import Footer from '@/components/Footer'
import '@/styles/globals.css'
import { useUI } from '@/lib/store'
import { useEffect } from 'react'

export default function Layout() {
  const { drawerOpen, setDrawer } = useUI()
  const location = useLocation()

  useEffect(() => {
    if (drawerOpen) setDrawer(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setDrawer(false)}
        />
      )}

      <Header />
      <Drawer />

      <div className="flex-1" onClick={() => drawerOpen && setDrawer(false)}>
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
