/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FLAVOR?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_LISTINGS_FROM_API?: string;
  /** 'console' | 'gtag' — anything else turns analytics off. */
  readonly VITE_ANALYTICS?: string;
}
