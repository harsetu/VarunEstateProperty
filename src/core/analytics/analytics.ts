import type { AnalyticsEventName } from '@/constants/analytics';

type Params = Record<string, string | number | boolean | undefined>;

/** Sink for tracking events. Add a provider (GA, Mixpanel…) by implementing this. */
export interface AnalyticsProvider {
  track(event: AnalyticsEventName, params?: Params): void;
}

class ConsoleProvider implements AnalyticsProvider {
  track(event: AnalyticsEventName, params?: Params) {
    console.debug('[analytics]', event, params ?? {});
  }
}

/** Google Analytics 4 / gtag, if the page has loaded it. */
class GtagProvider implements AnalyticsProvider {
  track(event: AnalyticsEventName, params?: Params) {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', event, params);
  }
}

const createProvider = (): AnalyticsProvider | null => {
  switch (import.meta.env.VITE_ANALYTICS) {
    case 'console': return new ConsoleProvider();
    case 'gtag': return new GtagProvider();
    default: return null; // off
  }
};

const provider = createProvider();

/** Never throws: analytics must not break the app. */
export const analytics = {
  track(event: AnalyticsEventName, params?: Params) {
    try { provider?.track(event, params); } catch { /* ignore */ }
  },
  pageView(path: string) {
    this.track('page_view', { path });
  },
};
