// src/types/workbox-shims.d.ts

export {}

declare global {
  // Workbox service worker eventi – minimum što nam treba da Typescript ućuti
  interface ExtendableEvent extends Event {
    waitUntil(fn: Promise<unknown> | Array<Promise<unknown>>): void
  }

  interface FetchEvent extends ExtendableEvent {
    request: Request
    respondWith(response: Response | Promise<Response>): void
  }

  // Šim za @unconfig / vite-plugin-pwa generic Args[0] – nebitno nam je šta je tačno
  type Args = any[]
}
