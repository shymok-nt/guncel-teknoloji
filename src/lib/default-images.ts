const CATEGORY_IMAGE_MAP: Record<string, { seed: number; label: string }> = {
  "yapay-zeka": { seed: 1, label: "yapay-zeka" },
  donanim: { seed: 2, label: "donanim" },
  mobil: { seed: 3, label: "mobil" },
  yazilim: { seed: 4, label: "yazilim" },
  bilim: { seed: 5, label: "bilim" },
  oyun: { seed: 6, label: "oyun" },
  guvenlik: { seed: 7, label: "guvenlik" },
};

const DEFAULT_SEED = 0;

export function getDefaultImage(categorySlug?: string, index: number = 0): string {
  const cat = CATEGORY_IMAGE_MAP[categorySlug ?? ""];
  const seed = cat ? cat.seed : DEFAULT_SEED;
  const variant = ((index % 3) + 1).toString();
  return `/api/placeholder?cat=${seed}&v=${variant}`;
}
