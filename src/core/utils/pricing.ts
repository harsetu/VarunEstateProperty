const CRORE = 1e7;
const LAKH = 1e5;

// At most 2 decimals, no trailing zeros (1.50 -> 1.5)
const trim = (n: number) => String(Number(n.toFixed(2)));

interface Part { num: string; unit: 'Cr' | 'Lakh' | '' }

const inrPart = (v: number): Part => {
  if (v >= CRORE) return { num: trim(v / CRORE), unit: 'Cr' };
  if (v >= LAKH) {
    const lakh = Number((v / LAKH).toFixed(2));
    return lakh >= 100 ? { num: '1', unit: 'Cr' } : { num: trim(lakh), unit: 'Lakh' };
  }
  return { num: v.toLocaleString('en-IN'), unit: '' };
};

const inr = (p: Part) => `₹${p.num}${p.unit && ` ${p.unit}`}`;

const other = (v: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${currency} ${v.toLocaleString('en-IN')}`;
  }
};

/** True when `priceMax` makes this a tentative range rather than a fixed price. */
export const isPriceRange = (price: number | null | undefined, priceMax: number | null | undefined) =>
  price != null && priceMax != null && priceMax !== price;

/**
 * "₹1.5 Cr", "₹85 Lakh", "₹45,000", or a range like "₹1.5 - 1.8 Cr" / "₹90 Lakh - ₹1.2 Cr".
 * `price` is the lower end. Returns '' when there is no price.
 */
export const formatPriceRange = (price: number | null | undefined, priceMax?: number | null, currency?: string | null) => {
  if (price == null) return '';
  const cur = currency || 'INR';
  const range = isPriceRange(price, priceMax);
  if (cur !== 'INR') return range ? `${other(price, cur)} - ${other(priceMax as number, cur)}` : other(price, cur);
  const lo = inrPart(price);
  if (!range) return inr(lo);
  const hi = inrPart(priceMax as number);
  return lo.unit && lo.unit === hi.unit ? `₹${lo.num} - ${hi.num} ${hi.unit}` : `${inr(lo)} - ${inr(hi)}`;
};

/** A single INR amount, e.g. for "from" prices. */
export const formatINR = (value: number) => formatPriceRange(value, null, 'INR');
