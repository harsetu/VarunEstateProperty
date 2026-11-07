import type { ContactQuery, ContactRepository } from '@/features/contact/repository/ContactRepository';
import { HttpError } from '@/core/network/tokens';
import { t } from '@/core/utils/i18n';

export interface WhatsappLeadConfig {
  /** VITE_BABBLER_BASE_URL, e.g. https://babbler-service.makunaiglobal.ai/babbler-service/v1 */
  baseUrl: string;
  apiKey: string;
  keyHeader: string;
  /** Business WhatsApp number the template is sent from. */
  senderNo: string;
  /** Number that receives each website enquiry. */
  recipientNo: string;
  recipientName: string;
  /** Optional: the recipient's contact id in the chat service. */
  contactId?: string;
}

const TEMPLATE = 'websiteleads';

/** WhatsApp template params can't hold line breaks or be empty. */
const param = (value: string) => value.replace(/\s*[\r\n\t]+\s*/g, ' ').replace(/ {5,}/g, '    ').trim() || '-';

/**
 * Sends each website enquiry to the business on WhatsApp through the chat service:
 * POST {base}/template/send, template "websiteleads" with {{1}} name, {{2}} email, {{3}} phone, {{4}} message.
 */
export class WhatsappContactRepository implements ContactRepository {
  constructor(private readonly config: WhatsappLeadConfig) {}

  async send({ name, phone, email, message }: ContactQuery) {
    const c = this.config;
    let res: Response;
    try {
      res = await fetch(`${c.baseUrl}/template/send`, {
        method: 'POST',
        headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json', [c.keyHeader]: c.apiKey },
        body: JSON.stringify({
          template_name: TEMPLATE,
          sender_no: c.senderNo,
          entity_type: 'contact',
          recipient_no: c.recipientNo,
          ...(c.contactId ? { contact_id: c.contactId } : {}),
          header_param: [],
          body_param: [param(name), param(email), param(phone), param(message)],
          url_param: [],
          contact_name: c.recipientName,
        }),
      });
    } catch {
      throw new Error(t('login.unreachable'));
    }
    if (!res.ok) {
      let detail = '';
      try { detail = ((await res.json()) as { message?: string }).message ?? ''; } catch { /* no body */ }
      throw new HttpError(detail || t('api.requestFailed', { status: res.status }), res.status);
    }
  }
}
