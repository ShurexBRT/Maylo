// src/app/Layout.tsx
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import Footer from '@/components/Footer'
import PWAInstallBanner from '@/components/PWAInstallBanner'
import { useUI } from '@/lib/store'
import '@/styles/globals.css'

export default function Layout() {
  const { drawerOpen, setDrawer } = useUI()
  const location = useLocation()

  // Svaka promena rute zatvara drawer (da ne ostane otvoren posle navigacije)
  useEffect(() => {
    if (drawerOpen) setDrawer(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Overlay za zatvaranje drawer-a na mobilnom */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setDrawer(false)}
          aria-hidden="true"
        />
      )}

      <Header />
      <Drawer />

      {/* Glavni sadržaj; klik zatvara drawer ako je otvoren */}
      <main className="flex-1" onClick={() => drawerOpen && setDrawer(false)}>
        <Outlet />
        {/* PWA install CTA prikazujemo u okviru sadržaja */}
        <PWAInstallBanner />
      </main>

      <Footer />
    </div>
  )
}
