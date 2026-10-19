import { en } from '@/constants/en';

export type StringKey = keyof typeof en;
type Params = Record<string, string | number>;

/** Looks up a UI string and fills `{placeholders}`. Add a new language by providing another map shaped like `en`. */
export const t = (key: StringKey, params?: Params): string => {
  const text: string = en[key];
  return params ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in params ? String(params[k]) : m)) : text;
};
