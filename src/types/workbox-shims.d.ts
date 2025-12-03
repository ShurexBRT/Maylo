// src/types/workbox-shims.d.ts

// Workbox expects ServiceWorker types to exist.
// We define minimal interfaces so TS stops crying.

interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}
