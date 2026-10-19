import { homeRepository } from '@/app/container';
import { CONTACT } from '@/core/config/contact';
import flavor from '@/flavors';

export function useAboutViewModel() {
  return { stats: homeRepository.getContent().stats, company: CONTACT.company, market: flavor.market, owner: flavor.owner };
}
