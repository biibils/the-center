export type PrologueScene = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export const prologueScenes: PrologueScene[] = [
  {
    id: "the-present",
    eyebrow: "ADEGAN I",
    title: "Masa Kini",
    paragraphs: [
      "Baitul Maqdis. Sebuah tempat yang menyimpan sejarah panjang, keyakinan, dan ingatan banyak generasi.",
      "Namun, seberapa jauh kita benar-benar mengenal tempat ini?",
    ],
  },
  {
    id: "the-questions",
    eyebrow: "ADEGAN II",
    title: "Pertanyaan yang Terlupakan",
    paragraphs: [
      "Mengapa tempat ini begitu berarti?",
      "Kisah apa yang tersembunyi di balik lapisan sejarahnya?",
      "Dan bagaimana masa lalunya terhubung dengan dunia yang kita kenal hari ini?",
    ],
  },
  {
    id: "the-stranger",
    eyebrow: "ADEGAN III",
    title: "Sosok Asing",
    paragraphs: [
      "Dalam keheningan, sesosok figur misterius muncul.",
      "Wajahnya tersembunyi. Kehadirannya justru melahirkan lebih banyak pertanyaan daripada jawaban.",
    ],
  },
  {
    id: "the-invitation",
    eyebrow: "ADEGAN IV",
    title: "Sebuah Undangan",
    paragraphs: [
      "Masa lalu tidak sedekat yang kau kira.",
      "Ada jawaban yang hanya bisa ditemukan dengan menelusuri kisah-kisah yang telah terjadi.",
    ],
  },
  {
    id: "the-transition",
    eyebrow: "ADEGAN V",
    title: "Melampaui Waktu",
    paragraphs: [
      "Dunia di sekelilingmu mulai berubah.",
      "Masa kini perlahan memudar. Sebuah babak sejarah yang terlupakan sedang menantimu.",
    ],
  },
];
