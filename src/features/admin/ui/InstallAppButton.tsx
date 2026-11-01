import { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';
import { t } from '@/core/utils/i18n';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/** "Install app" for the admin: uses the browser's install prompt, or explains Add to Home Screen on iPhone. */
export default function InstallAppButton({ className = '' }: { className?: string }) {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    const onPrompt = (e: Event) => { e.preventDefault(); setEvent(e as InstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setEvent(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const ios = isIos();
  if (installed || (!event && !ios)) return null;

  const click = async () => {
    if (event) {
      await event.prompt();
      await event.userChoice;
      setEvent(null);
    } else setHelp((v) => !v);
  };

  return (
    <div className={className}>
      <button type="button" onClick={click} className="inline-flex items-center gap-2 rounded-full border border-fg/15 px-4 py-2 text-sm font-semibold text-fg hover:border-gold hover:text-gold transition-colors">
        <Download size={16} /> {t('admin.install')}
      </button>
      {help && (
        <p className="mt-2 text-ash text-sm flex items-center flex-wrap gap-1">
          {t('admin.install.ios1')} <Share size={14} /> {t('admin.install.ios2')}
        </p>
      )}
    </div>
  );
}
