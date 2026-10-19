import { Fragment, type ReactNode } from 'react';
import { t, type StringKey } from '@/core/utils/i18n';

/** Like `t`, but turns <em>…</em> in the string into the gold emphasised style used in headings. */
export const rich = (key: StringKey, params?: Record<string, string | number>, emClass = 'text-gold'): ReactNode =>
  t(key, params)
    .split(/(<em>.*?<\/em>)/g)
    .map((part, i) =>
      part.startsWith('<em>')
        ? <em key={i} className={emClass}>{part.slice(4, -5)}</em>
        : <Fragment key={i}>{part}</Fragment>,
    );
