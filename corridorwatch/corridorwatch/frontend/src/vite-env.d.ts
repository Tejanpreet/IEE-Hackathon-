/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_USE_MOCKS?: 'true' | 'false';
}
interface ImportMeta { readonly env: ImportMetaEnv }
