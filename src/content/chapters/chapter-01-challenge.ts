import type { InvestigationChallenge } from "@/features/challenges/types";

export const chapter01Challenge: InvestigationChallenge = {
  id: "the-forty-year-mystery",
  chapterId: "chapter-01",
  title: "The Forty-Year Mystery",
  subtitle: "Misteri Empat Puluh Tahun",
  introduction:
    "Dua tempat suci. Dua lokasi yang terpisah jauh. Sebuah riwayat menyebutkan jarak waktu empat puluh tahun antara keduanya. Sekarang, gunakan bukti yang telah kamu temukan untuk memisahkan fakta dari dugaan.",
  questions: [
    {
      id: "question-01",
      question:
        "Menurut hadis Abu Dharr, tempat ibadah manakah yang pertama kali dibangun untuk manusia?",
      evidence:
        "Bukti: QS. Ali 'Imran ayat 96 dan hadis Abu Dharr dalam Sahih al-Bukhari serta Sahih Muslim.",
      options: [
        {
          id: "a",
          text: "Masjidil Aqsa",
        },
        {
          id: "b",
          text: "Masjidil Haram",
        },
        {
          id: "c",
          text: "Masjid Nabawi",
        },
        {
          id: "d",
          text: "Masjid Quba",
        },
      ],
      correctAnswer: "b",
      explanation:
        "Hadis Abu Dharr menyebut Masjidil Haram sebagai masjid pertama, kemudian Masjidil Aqsa sebagai yang berikutnya.",
    },
    {
      id: "question-02",
      question:
        "Berapa rentang waktu antara pembangunan kedua masjid menurut hadis tersebut?",
      evidence:
        "Bukti: Riwayat Abu Dharr tentang urutan Masjidil Haram dan Masjidil Aqsa.",
      options: [
        {
          id: "a",
          text: "Sepuluh tahun",
        },
        {
          id: "b",
          text: "Dua puluh lima tahun",
        },
        {
          id: "c",
          text: "Empat puluh tahun",
        },
        {
          id: "d",
          text: "Seratus tahun",
        },
      ],
      correctAnswer: "c",
      explanation:
        "Hadis tersebut menyebut jarak empat puluh tahun antara keduanya.",
    },
    {
      id: "question-03",
      question:
        "Apakah hadis tersebut secara eksplisit menyebut Nabi Adam AS sebagai pembangun kedua masjid?",
      evidence:
        "Bukti: Perhatikan redaksi hadis Abu Dharr. Bedakan informasi yang disebutkan secara langsung dengan kesimpulan yang memerlukan penafsiran.",
      options: [
        {
          id: "a",
          text: "Ya, disebutkan secara eksplisit",
        },
        {
          id: "b",
          text: "Tidak, identitas pembangunnya tidak disebutkan secara eksplisit",
        },
        {
          id: "c",
          text: "Ya, tetapi hanya untuk Masjidil Aqsa",
        },
        {
          id: "d",
          text: "Tidak ada informasi tentang dua masjid tersebut",
        },
      ],
      correctAnswer: "b",
      explanation:
        "Hadis menyebut urutan dan jarak waktu, tetapi tidak secara eksplisit menyebut siapa yang membangun kedua masjid. Menghubungkannya dengan Nabi Adam AS merupakan pembahasan interpretatif yang perlu ditelusuri melalui sumber lain.",
    },
  ],
  completionMessage:
    "Kamu telah menyelesaikan investigasi pertama. Namun, menjadi seorang Explorer bukan hanya tentang menemukan jawaban. Lebih penting lagi, kamu belajar membedakan bukti, interpretasi, dan pertanyaan yang masih terbuka.",
};
