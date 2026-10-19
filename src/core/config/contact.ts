import flavor from '@/flavors';
import { buildMapEmbedUrl, buildWhatsappLink } from '@/core/utils/contactLinks';

// Business details come from the active flavor (src/flavors/<id>).
export const CONTACT = flavor.contact;

export const mapEmbedUrl = buildMapEmbedUrl;

export const whatsappLink = (text: string) => buildWhatsappLink(CONTACT.whatsapp, text);
