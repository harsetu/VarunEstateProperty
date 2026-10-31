// Indian mobile: optional +91/0 prefix, then 10 digits starting 6-9
export const normalizePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};
