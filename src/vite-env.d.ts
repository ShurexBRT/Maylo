/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // dodaj sve svoje VITE_* promenljive
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
