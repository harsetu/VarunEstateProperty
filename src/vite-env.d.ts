/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FLAVOR?: string;
  readonly VITE_API_BASE_URL?: string;
  /** Chat inbox service base URL, e.g. https://babbler-service.makunaiglobal.ai/babbler-service/v1 */
  readonly VITE_BABBLER_BASE_URL?: string;
  readonly VITE_BABBLER_API_KEY?: string;
  /** Header that carries the key (default API-KEY). */
  readonly VITE_BABBLER_API_KEY_HEADER?: string;
  /** WhatsApp enquiries: business number the template is sent from, who receives it, and (optional) the receiver's contact id. */
  readonly VITE_BABBLER_SENDER_NO?: string;
  readonly VITE_BABBLER_LEAD_NO?: string;
  readonly VITE_BABBLER_LEAD_CONTACT_ID?: string;
  readonly VITE_LISTINGS_FROM_API?: string;
  /** 'console' | 'gtag' — anything else turns analytics off. */
  readonly VITE_ANALYTICS?: string;
}
