const fromPublic = (files: string[]) => files.map((file) => `/awards/${file}`);

/** Awards strip: public/awards/1.png … 9.png, then a1.png … a4.png. */
export const AWARD_IMAGES = fromPublic([
  ...Array.from({ length: 9 }, (_, i) => `${i + 1}.png`),
  ...Array.from({ length: 4 }, (_, i) => `a${i + 1}.png`),
]);
