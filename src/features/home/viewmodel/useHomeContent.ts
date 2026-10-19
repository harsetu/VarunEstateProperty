import { homeRepository } from '@/app/container';

/** Static home-page content (no listings needed). */
export const useHomeContent = () => homeRepository.getContent();
