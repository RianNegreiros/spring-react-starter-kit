interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_OAUTH_URL: string
  readonly VITE_GITHUB_OAUTH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
