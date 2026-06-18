export interface Haber {
  id: string;
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  kapakGorseli: string;
  kategori: string;
  etiketler: string[];
  yazar: string;
  kaynak: string;
  yayinTarihi: string;
  guncellenmeTarihi?: string;
  goruntulenme: number;
}

export interface Kategori {
  id: string;
  slug: string;
  ad: string;
  aciklama: string;
}
