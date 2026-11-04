/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string
  readonly VITE_SITE_PHONE: string
  readonly VITE_SITE_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
