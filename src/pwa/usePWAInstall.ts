// src/pwa/usePWAInstall.ts
import { useEffect, useState } from 'react'

type BIPEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const INSTALLED_KEY = 'maylo_pwa_installed'

function getInitialInstalled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(INSTALLED_KEY) === '1'
  } catch {
    return false
  }
}

export function usePWAInstall() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [installed, setInstalled] = useState<boolean>(getInitialInstalled)
  const [supported, setSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return 'onbeforeinstallprompt' in window
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
      setSupported(true)
    }

    const onInstalled = () => {
      setInstalled(true)
      try {
        localStorage.setItem(INSTALLED_KEY, '1')
      } catch {
        // ignore
      }
    }

    window.addEventListener('beforeinstallprompt', onBIP)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferred) return
    try {
      await deferred.prompt()
      await deferred.userChoice
    } finally {
      setDeferred(null)
    }
  }

  return {
    canInstall: Boolean(deferred) && !installed,
    promptInstall,
    installed,
    supported,
  }
}
