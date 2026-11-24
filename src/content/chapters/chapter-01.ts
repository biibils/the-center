export type ChapterLocation = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  historicalContext: string[];
  discoveries: string[];
};

export type Chapter = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  locations: ChapterLocation[];
};

export const chapter01: Chapter = {
  id: "chapter-01",
  number: "01",
  title: "The First Foundations",
  subtitle: "Menelusuri Jejak Dua Tempat Suci",
  description:
    "Sebuah perjalanan untuk memahami sejarah awal dua tempat suci yang memiliki kedudukan penting dalam tradisi Islam.",

  locations: [
    {
      id: "valley-of-bakkah",
      number: "01",
      title: "Lembah Bakkah",
      subtitle: "Tempat yang Diberkahi",
      description:
        "Sebuah lembah yang kelak menjadi pusat peribadatan dan tujuan jutaan manusia dari berbagai penjuru dunia.",

      historicalContext: [
        "Sesungguhnya rumah ibadah pertama yang dibangun untuk manusia adalah yang berada di Bakkah, yang diberkahi dan menjadi petunjuk bagi seluruh alam.",
        "QS. Ali 'Imran: 96",
      ],

      discoveries: [
        "Bakkah disebut secara khusus dalam Al-Qur'an.",
        "Masjidil Haram memiliki kedudukan istimewa dalam tradisi Islam.",
      ],
    },

    {
      id: "the-distant-sanctuary",
      number: "02",
      title: "Tempat Suci yang Jauh",
      subtitle: "Sebuah Tempat dalam Perjalanan Malam",
      description:
        "Di sebuah tempat yang jauh dari Makkah, terdapat tempat suci yang disebut dalam kisah perjalanan malam Rasulullah ﷺ.",

      historicalContext: [
        "Mahasuci Allah yang telah memperjalankan hamba-Nya pada suatu malam dari Masjidil Haram ke Masjidil Aqsa yang telah Kami berkahi sekelilingnya.",
        "QS. Al-Isra': 1",
      ],

      discoveries: [
        "Al-Masjid Al-Aqsa memiliki kedudukan penting dalam Islam.",
        "Baitul Maqdis memiliki sejarah panjang yang melampaui satu periode kehidupan manusia.",
      ],
    },

    {
      id: "the-forty-year-mystery",
      number: "03",
      title: "Misteri Empat Puluh Tahun",
      subtitle: "Dua Masjid, Satu Rentang Waktu",
      description:
        "Sebuah pertanyaan muncul dari riwayat tentang jarak waktu antara pembangunan dua masjid pertama.",

      historicalContext: [
        "Dalam hadis Abu Dharr, Rasulullah ﷺ menjelaskan bahwa Masjidil Haram merupakan masjid pertama, kemudian Masjidil Aqsa, dengan jarak waktu empat puluh tahun di antara keduanya.",
        "HR. Bukhari dan Muslim.",
      ],

      discoveries: [
        "Riwayat tersebut menyebut jarak empat puluh tahun.",
        "Hadis tersebut tidak secara eksplisit menyebut siapa yang membangun kedua masjid tersebut.",
        "Identitas pembangunan fondasi awal menjadi pertanyaan yang perlu ditelusuri lebih lanjut.",
      ],
    },

    {
      id: "the-first-foundations",
      number: "04",
      title: "Fondasi Pertama",
      subtitle: "Menelusuri Asal-Usul",
      description:
        "Siapa yang pertama kali meletakkan fondasi kedua tempat suci ini? Sebuah pertanyaan yang membawa kita pada beragam riwayat dan penafsiran.",

      historicalContext: [
        "Terdapat berbagai penjelasan dan penafsiran mengenai siapa yang pertama kali meletakkan fondasi kedua tempat suci tersebut.",
        "Sebagian pendapat menghubungkannya dengan Nabi Adam AS, tetapi hal ini perlu dibedakan dari informasi yang secara eksplisit disebutkan dalam Al-Qur'an dan hadis sahih.",
      ],

      discoveries: [
        "Al-Qur'an dan hadis sahih menjadi rujukan utama.",
        "Riwayat sejarah dan penafsiran perlu dinilai berdasarkan kekuatan sumbernya.",
        "Tidak semua pertanyaan sejarah memiliki jawaban yang pasti.",
      ],
    },
  ],
};
