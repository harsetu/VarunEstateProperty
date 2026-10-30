import flavor from '@/flavors';
import { buildMapEmbedUrl, buildMapLink, buildWhatsappLink } from '@/core/utils/contactLinks';

// Business details come from the active flavor (src/flavors/<id>).
export const CONTACT = flavor.contact;

export const mapEmbedUrl = buildMapEmbedUrl;

export const mapLink = () => buildMapLink(CONTACT.mapQuery);

export const whatsappLink = (text: string) => buildWhatsappLink(CONTACT.whatsapp, text);
