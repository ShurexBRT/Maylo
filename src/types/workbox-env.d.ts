// Minimalni shim da Workbox tipovi budu srećni

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void
}
