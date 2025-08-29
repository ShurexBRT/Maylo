import { usePWAInstall } from '@/pwa/usePWAInstall'
import { useEffect, useState } from 'react'

export default function PWAInstallBanner() {
  const { canInstall, promptInstall, installed } = usePWAInstall()
  const [hidden, setHidden] = useState(false)

  // sakrij na iOS-u (Safari nema beforeinstallprompt) – prikazaćemo hint u FAQ-u
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)

  useEffect(() => {
    if (installed) setHidden(true)
  }, [installed])

  if (hidden || isIOS || !canInstall) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]">
      <div className="bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 border">
        <img src="/icons/icon-192.png" alt="Maylo" className="w-8 h-8" />
        <div className="text-sm">
          <div className="font-semibold">Install Maylo</div>
          <div className="text-gray-600">Get quick access from your home screen</div>
        </div>
        <button
          onClick={promptInstall}
          className="ml-3 btn-primary px-3 py-2 rounded-xl"
        >
          Install
        </button>
        <button
          onClick={() => setHidden(true)}
          className="ml-1 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
