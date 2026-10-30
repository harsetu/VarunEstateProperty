import type { ContactQuery } from '@/features/contact/repository/ContactRepository';

export type MessageStatus = 'sent' | 'failed';

/** One send attempt, kept on the visitor's device. */
export interface SentMessage extends ContactQuery {
  id: string;
  status: MessageStatus;
  error?: string;
  /** ISO time of the latest attempt. */
  at: string;
}
