// Sale prices in Lakhs/Cr; small values are monthly rents
export const formatINR = (value: number) => {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (value >= 1e5) return `₹${Math.round(value / 1e5)} Lakhs`;
  return `₹${value.toLocaleString('en-IN')}/mo`;
};
