const fromPublic = (files: string[]) => files.map((file) => `/awards/${file}`);

/** First awards strip: public/awards/1.jpeg … 9.png. */
export const AWARD_IMAGES = fromPublic(Array.from({ length: 9 }, (_, i) => `${i + 1}.png`));

/** Second awards section: public/awards/a1.jpeg … a4.jpeg. */
export const AWARD_IMAGES_MORE = fromPublic(['a1.png', 'a2.png', 'a3.png', 'a4.png']);
