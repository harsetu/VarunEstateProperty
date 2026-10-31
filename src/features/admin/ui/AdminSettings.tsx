import { Check } from 'lucide-react';
import { useThemeSettingsViewModel } from '@/features/admin/viewmodel/useThemeSettingsViewModel';
import { THEME_IDS, THEME_LABELS, type ThemeId } from '@/core/theme/themes';
import { t } from '@/core/utils/i18n';

// The wrapper's data-theme gives the mini preview that theme's own palette
function Preview({ id }: { id: ThemeId }) {
  return (
    <div data-theme={id} className="rounded-xl border border-fg/10 bg-ink-900 p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-fg text-sm leading-none">Aa</span>
        <span className="flex gap-1"><span className="h-1.5 w-5 rounded-full bg-ash/50" /><span className="h-1.5 w-5 rounded-full bg-ash/50" /></span>
      </div>
      <div className="rounded-lg bg-night p-3 mb-2">
        <span className="block h-2 w-16 rounded-full bg-white mb-1.5" />
        <span className="block h-1.5 w-24 rounded-full bg-white/50 mb-3" />
        <span className="inline-block h-4 w-14 rounded-full bg-gold" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white p-2 shadow-card"><span className="block h-1.5 w-8 rounded-full bg-gold mb-1" /><span className="block h-1.5 w-12 rounded-full bg-ash/40" /></div>
        <div className="rounded-lg bg-ink-800 p-2"><span className="block h-1.5 w-8 rounded-full bg-gold-dark mb-1" /><span className="block h-1.5 w-12 rounded-full bg-ash/40" /></div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const vm = useThemeSettingsViewModel();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-semibold text-fg text-2xl mb-1">{t('settings.title')}</h1>
      <h2 className="font-semibold text-fg mt-6">{t('theme.title')}</h2>
      <p className="text-ash text-sm mb-4">{t('theme.intro')}</p>

      {vm.message && <p role="status" className={`text-sm mb-3 ${vm.message.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{vm.message.text}</p>}
      {vm.loading && <p className="text-ash">{t('theme.loading')}</p>}

      <div role="radiogroup" aria-label={t('theme.title')} className="grid sm:grid-cols-3 gap-4">
        {THEME_IDS.map((id) => {
          const on = vm.selected === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => vm.setSelected(id)}
              className={`text-left rounded-2xl bg-white p-3 shadow-card transition ring-2 ${on ? 'ring-gold' : 'ring-transparent hover:ring-fg/20'}`}
            >
              <Preview id={id} />
              <span className="flex items-center justify-between gap-2 mt-3">
                <span>
                  <span className="block font-semibold text-fg text-sm">{THEME_LABELS[id].name}</span>
                  <span className="block text-xs text-ash">{THEME_LABELS[id].blurb}</span>
                </span>
                {vm.active === id && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[0.6875rem] font-semibold px-2 py-0.5">
                    <Check size={11} /> {t('theme.active')}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <button onClick={vm.save} disabled={!vm.dirty || vm.busy || vm.loading} className="neopop-btn mt-5 disabled:opacity-50">
        {vm.busy ? t('theme.saving') : t('theme.save')}
      </button>
    </div>
  );
}
