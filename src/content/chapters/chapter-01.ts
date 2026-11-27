export type SourceReference = {
  id: string;
  badge: string; // Contoh: "AL-QUR'AN", "HADIS SAHIH", "CATATAN ULAMA"
  reference: string; // Contoh: "QS. Ali 'Imran: 96"
  title: string;
  narrationSummary: string; // Intisari / redaksi riwayat untuk popup
  scholarlyNote?: string; // Catatan perbedaan pendapat ulama (ikhtilaf) & konteks riset
};

export type ChapterLocation = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  regionLabel: string;
  coordinates: string;
  description: string;
  storySegments: string[]; // Narasi storytelling ilmiah (tanpa menempelkan teks mentah riwayat)
  wisdom: string; // Hikmah & refleksi peradaban
  discoveries: string[];
  sources: SourceReference[]; // Muncul saat tombol sumber diklik
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
    "Perjalanan menyusuri koridor sejarah antara lembah tandus di Hijaz dan perbukitan suci di Syam—dua poros peradaban tauhid yang terhubung sejak fajar kemanusiaan.",

  locations: [
    {
      id: "valley-of-bakkah",
      number: "01",
      title: "Lembah Bakkah",
      subtitle: "Poros Pertama Peribadatan Manusia",
      regionLabel: "HIJAZ · MAKKAH",
      coordinates: "21°25'21\"N 39°49'34\"E",
      description:
        "Di tengah cekungan perbukitan batu yang kering dan sunyi di wilayah Hijaz, berdiri sebuah titik koordinat yang kelak menjadi magnet spiritual bagi miliaran manusia lintas zaman.",
      storySegments: [
        "Jauh sebelum jalur perdagangan kafilah ramai melintasi Jazirah Arab, Al-Qur'an memperkenalkan lembah ini dengan nama purbanya: Bakkah. Para ahli bahasa dan sejarawan klasik mencatat bahwa nama ini menggambarkan tempat yang menyesakkan karena ramainya manusia yang berdesakan datang beribadah, sekaligus tempat yang meruntuhkan kesombongan para penguasa.",
        "Secara geografis, lembah ini bukanlah tanah subur yang dikelilingi sungai besar seperti pusat-pusat peradaban kuno di Mesopotamia atau Lembah Nil. Justru di atas lembah yang tandus dan terisolasi inilah rumah ibadah pertama bagi seluruh umat manusia ditetapkan sebagai pusat orientasi dan keberkahan.",
        "Keberadaan Bakkah menjadi titik berangkat utama dalam peta sejarah kita: bahwa kemuliaan sebuah tempat tidak lahir dari kelimpahan materi alamnya, melainkan dari penetapan wahyu dan fungsi peradabannya.",
      ],
      wisdom:
        "Peradaban yang kokoh selalu dimulai dari pusat orientasi nilai yang jelas. Sebelum manusia membangun kota dan kekuasaan, mereka membutuhkan arah kiblat yang menyatukan tujuan.",
      discoveries: [
        "Nama purba 'Bakkah' merujuk pada kawasan inti Baitullah di Makkah yang memiliki akar makna keramaian dan ketundukan.",
        "Masjidil Haram ditetapkan sebagai rumah ibadah pertama yang dibangun untuk seluruh umat manusia.",
        "Letak geografisnya yang tandus menegaskan bahwa keberkahan tempat ini bersumber dari ketetapan ilahi, bukan faktor sumber daya alam.",
      ],
      sources: [
        {
          id: "src-bakkah-quran",
          badge: "AL-QUR'AN",
          reference: "QS. Ali 'Imran [3]: 96",
          title: "Penetapan Rumah Ibadah Pertama di Bakkah",
          narrationSummary:
            "Ayat ini menegaskan bahwa rumah ibadah pertama yang diletakkan bagi manusia adalah yang berada di Bakkah, dalam keadaan diberkahi dan menjadi petunjuk bagi seluruh alam.",
          scholarlyNote:
            "Dalam kitab-kitab tafsir (seperti Tafsir al-Thabari dan Ibnu Katsir), ulama menjelaskan hubungan nama 'Bakkah' dan 'Makkah'. Mayoritas mufasir memandang keduanya adalah nama bagi kota yang sama—Bakkah digunakan saat menyebut kawasan sekitar Ka'bah dan tempat thawaf, sedangkan Makkah untuk keseluruhan wilayah tanah haram.",
        },
        {
          id: "src-bakkah-ibrahim",
          badge: "AL-QUR'AN",
          reference: "QS. Ibrahim [14]: 37",
          title: "Lembah Tanpa Pepohonan di Sisi Rumah Suci",
          narrationSummary:
            "Dalam doanya, Nabi Ibrahim AS menggambarkan lembah tempat ia menempatkan keturunannya sebagai lembah yang tidak memiliki tanam-tanaman, tepat di sisi Rumah Allah yang dimuliakan.",
          scholarlyNote:
            "Para sejarawan mencatat bahwa ketika Nabi Ibrahim AS tiba di lembah ini bersama Hajar dan Ismail AS, bangunan Ka'bah saat itu telah rata/tertimbun tanah akibat perubahan alam selama berabad-abad, sebelum akhirnya fondasinya ditinggikan kembali.",
        },
      ],
    },

    {
      id: "the-distant-sanctuary",
      number: "02",
      title: "Tempat Suci yang Jauh",
      subtitle: "Poros Keberkahan di Tanah Syam",
      regionLabel: "AL-QUDS · LEVANT",
      coordinates: "31°46'34\"N 35°14'09\"E",
      description:
        "Lebih dari seribu dua ratus kilometer ke arah utara dari Makkah, di atas dataran tinggi berbatu yang menghadap Lembah Yordan, berdiri poros suci kedua yang menjadi persinggahan para nabi.",
      storySegments: [
        "Dalam peristiwa agung Isra', perjalanan malam Rasulullah ﷺ tidak berhenti di langit, melainkan terlebih dahulu menghubungkan dua titik di bumi: dari Masjidil Haram menuju Masjidil Aqsa. Penyebutan nama 'Al-Aqsa' (yang terjauh) mencerminkan jarak geografisnya yang terbentang melintasi gurun Hijaz hingga perbukitan Syam.",
        "Yang menarik, wahyu tidak hanya menyematkan kemuliaan pada bangunan fisik Masjidil Aqsa semata, tetapi juga meluaskan keberkahan itu ke kawasan di sekelilingnya—meliputi tanah Syam yang menjadi saksi risalah para nabi Bani Israil dan tempat bermuaranya sejarah panjang umat terdahulu.",
        "Dengan mempertemukan kedua tempat ini dalam satu malam perjalanan, sejarah Islam menegaskan bahwa Masjidil Haram dan Masjidil Aqsa bukanlah dua entitas yang terpisah, melainkan dua simpul dalam satu garis risalah yang sama.",
      ],
      wisdom:
        "Menjaga Baitul Maqdis adalah bagian dari menjaga keutuhan memori kenabian. Keterikatan seorang mukmin terhadap Al-Aqsa berakar pada akidah dan sejarah wahyu, bukan sekadar sentimen wilayah.",
      discoveries: [
        "Peristiwa Isra' secara langsung mengikat kedudukan Masjidil Haram dengan Masjidil Aqsa dalam satu kesatuan akidah.",
        "Keberkahan Masjidil Aqsa dalam Al-Qur'an mencakup kawasan di sekelilingnya (Negeri Syam), bukan hanya satu titik bangunan.",
        "Masjidil Aqsa merupakan kiblat pertama umat Islam sebelum arah kiblat dialihkan ke Ka'bah.",
      ],
      sources: [
        {
          id: "src-aqsa-isra",
          badge: "AL-QUR'AN",
          reference: "QS. Al-Isra' [17]: 1",
          title: "Perjalanan Malam Menghubungkan Dua Masjid Suci",
          narrationSummary:
            "Ayat pembuka Surah Al-Isra' mengabadikan perjalanan malam hamba-Nya (Nabi Muhammad ﷺ) dari Masjidil Haram ke Masjidil Aqsa yang telah diberkahi kawasan di sekelilingnya untuk diperlihatkan tanda-tanda kebesaran Allah.",
          scholarlyNote:
            "Para ulama tafsir dan sejarawan (seperti Ibnu Hajar dalam Fath al-Bari) menjelaskan bahwa pada masa peristiwa Isra', bentuk fisik masjid di Al-Quds tidak berupa bangunan megah seperti masa Nabi Sulaiman AS, karena telah mengalami kehancuran pada era Babilonia dan Romawi. Namun status kesucian tempat (Al-Haram Al-Qudsi) tetap melekat pada tanah tersebut.",
        },
      ],
    },

    {
      id: "the-forty-year-mystery",
      number: "03",
      title: "Misteri Empat Puluh Tahun",
      subtitle: "Jejak Kronologi Dua Poros Suci",
      regionLabel: "SACRED AXIS · HIJAZ—SYAM",
      coordinates: "26°42'10\"N 37°18'50\"E",
      description:
        "Sebuah dialog singkat antara sahabat Abu Dzar al-Ghifari dan Rasulullah ﷺ membuka tabir kronologi purba yang menggugah para sejarawan selama berabad-abad.",
      storySegments: [
        "Suatu ketika, sahabat Abu Dzar al-Ghifari mengajukan pertanyaan mendasar kepada Nabi ﷺ tentang masjid pertama yang diletakkan di muka bumi. Jawabannya tegas: Masjidil Haram. Namun ketika Abu Dzar menanyakan masjid kedua setelahnya, jawaban Nabi ﷺ membuka misteri sejarah yang sangat dalam: Masjidil Aqsa—dengan rentang waktu hanya empat puluh tahun di antara keduanya.",
        "Angka empat puluh tahun ini seketika memicu pertanyaan besar jika dibandingkan dengan lini masa populer sejarah para nabi. Dalam catatan silsilah kenabian, jarak antara Nabi Ibrahim AS (yang meninggikan Ka'bah di Makkah) dan Nabi Sulaiman AS (yang membangun kembali Baitul Maqdis di Yerusalem) terbentang sekitar seribu tahun lebih.",
        "Kontras tajam antara 'empat puluh tahun' dalam hadis sahih dan 'seribu tahun' dalam kronologi kerajaan Bani Israil menjadi kunci investigasi: keduanya bukanlah angka yang saling bertentangan, melainkan merujuk pada fase pembangunan yang berbeda.",
      ],
      wisdom:
        "Dalam meneliti sejarah, ketelitian membedakan antara 'peletakan fondasi pertama' dan 'pembangunan ulang' akan menyelamatkan kita dari kesimpulan yang tergesa-gesa.",
      discoveries: [
        "Hadis sahih riwayat Bukhari dan Muslim menetapkan jarak 40 tahun antara peletakan Masjidil Haram dan Masjidil Aqsa.",
        "Terdapat selisih sekitar 1.000 tahun antara era Nabi Ibrahim AS dan era Nabi Sulaiman AS.",
        "Hadis Abu Dzar membuktikan bahwa Masjidil Aqsa sudah jauh lebih tua daripada masa Nabi Sulaiman AS.",
      ],
      sources: [
        {
          id: "src-abudzar-hadith",
          badge: "HADIS SAHIH",
          reference: "HR. Al-Bukhari (no. 3366) & Muslim (no. 520)",
          title: "Riwayat Abu Dzar tentang Jarak 40 Tahun",
          narrationSummary:
            "Sahabat Abu Dzar RA bertanya kepada Rasulullah ﷺ mengenai masjid yang pertama kali diletakkan di bumi, lalu beliau menjawab 'Al-Masjid Al-Haram'. Ketika ditanya masjid berikutnya, beliau menjawab 'Al-Masjid Al-Aqsa', dan menyebutkan jarak waktu di antara pembangunan keduanya adalah empat puluh tahun.",
          scholarlyNote:
            "Catatan Ulama (Ibnu Hajar al-Asqalani dalam Fath al-Bari & Ibnu Taimiyah): Para ulama sepakat bahwa hadis ini menjadi dalil kuat bahwa Nabi Sulaiman AS bukanlah pendiri pertama Masjidil Aqsa, melainkan pemugar (renovator) yang membangunnya kembali secara megah—sebagaimana Nabi Ibrahim AS meninggikan kembali fondasi Ka'bah yang sudah ada sebelumnya.",
        },
      ],
    },

    {
      id: "the-first-foundations",
      number: "04",
      title: "Fondasi Pertama",
      subtitle: "Menyibak Pelaku Sejarah di Balik Kabut Zaman",
      regionLabel: "CONVERGENCE · PRIMORDIAL ROOTS",
      coordinates: "29°33'15\"N 35°00'22\"E",
      description:
        "Jika Nabi Ibrahim dan Nabi Sulaiman adalah para pemugar yang meninggikan kembali bangunan suci, lalu siapakah tangan pertama yang meletakkan batu fondasi kedua masjid tersebut?",
      storySegments: [
        "Ketika para ulama dan sejarawan menelusuri jejak sebelum masa Nabi Ibrahim AS, mereka mendapati bahwa teks Al-Qur'an dan hadis sahih secara sengaja tidak menyebutkan nama sosok yang pertama kali meletakkan fondasi kedua masjid tersebut. Ketiadaan penyebutan eksplisit ini melatih ketelitian metodologi keilmuan dalam tradisi Islam.",
        "Dalam literatur tafsir dan tarikh, muncul beberapa pandangan yang saling melengkapi untuk menjelaskan periode purba ini. Sebagian ulama berpendapat bahwa Nabi Adam AS sendirilah yang pertama kali meletakkan dasar Masjidil Haram, lalu empat puluh tahun kemudian beliau atau keturunannya meletakkan dasar Masjidil Aqsa.",
        "Pandangan lain menisbatkannya kepada para malaikat sebelum penciptaan manusia, atau kepada generasi awal keturunan Adam AS, sementara sebagian ulama lainnya menghubungkan pemugaran awal keduanya pada era Nabi Ibrahim AS dan putranya atau cucunya (Nabi Ishaq dan Nabi Ya'qub AS). Apa pun rincian sosok pertamanya, keduanya berpulang pada satu hakikat: fondasi keduanya diletakkan di atas tauhid yang sama sejak awal peradaban.",
      ],
      wisdom:
        "Kejujuran intelektual dalam tradisi Islam tercermin dari kemampuan membedakan antara dalil yang pasti (qath'i) dengan analisis sejarah (ijtihad tarikh)—tanpa memaksakan kepastian pada hal yang didiamkan oleh wahyu.",
      discoveries: [
        "Al-Qur'an dan hadis sahih tidak menyebut secara eksplisit nama individu yang pertama kali meletakkan fondasi kedua masjid.",
        "Terdapat beberapa pendapat ulama: Nabi Adam AS, para malaikat, atau pemugaran beruntun oleh keluarga Nabi Ibrahim AS.",
        "Nabi Ibrahim AS (di Makkah) dan Nabi Sulaiman AS (di Al-Quds) berperan sebagai pemugar dan peninggi bangunan yang fondasinya telah ada.",
      ],
      sources: [
        {
          id: "src-foundations-ibnkathir",
          badge: "CATATAN ULAMA",
          reference: "Al-Bidayah wa al-Nihayah & Fath al-Bari",
          title: "Ikhtilaf Ulama tentang Peletak Fondasi Pertama",
          narrationSummary:
            "Para ahli sejarah dan hadis menghimpun beberapa riwayat mengenai peletak fondasi awal Masjidil Haram dan Masjidil Aqsa sebelum era pemugaran Nabi Ibrahim AS dan Nabi Sulaiman AS.",
          scholarlyNote:
            "Perbedaan Pendapat Ulama:\n1. Pendapat Pertama (Nabi Adam AS): Diriwayatkan dari sejumlah ulama salaf bahwa Nabi Adam AS membangun Baitullah pertama kali, kemudian empat puluh tahun setelahnya membangun Baitul Maqdis (disebutkan oleh Ibnu Hajar dari jalur Ibnu Hisyam dan lainnya).\n2. Pendapat Kedua (Para Malaikat): Sebagian riwayat atsar menyebut para malaikat telah membangun rumah ibadah di bumi sebelum penciptaan Nabi Adam AS.\n3. Pendapat Ketiga (Nabi Ibrahim AS & Nabi Ya'qub AS): Sebagian ulama (seperti yang didiskusikan Ibnu al-Qayyim dalam Zad al-Ma'ad) mengaitkan rentang 40 tahun tersebut dengan selisih waktu antara Nabi Ibrahim AS meninggikan Ka'bah dan Nabi Ya'qub AS (cucu Ibrahim) menetapkan tempat ibadah di Baitul Maqdis, jauh sebelum dibangun megah oleh Nabi Sulaiman AS. Ibnu Hajar menilai pendapat pertama (Nabi Adam AS) lebih selaras dengan makna 'peletakan pertama' (awwalu masjidin wudhi'a) dalam hadis Abu Dzar.",
        },
        {
          id: "src-foundations-baqarah",
          badge: "AL-QUR'AN",
          reference: "QS. Al-Baqarah [2]: 127",
          title: "Nabi Ibrahim AS Meninggikan Fondasi yang Telah Ada",
          narrationSummary:
            "Ayat ini menceritakan bagaimana Nabi Ibrahim AS dan Nabi Ismail AS meninggikan (yarfa'u) fondasi-fondasi Baitullah—menunjukkan bahwa dasar fondasinya sudah ada di tempat tersebut.",
          scholarlyNote:
            "Penggunaan kata kerja 'yarfa'u al-qawa'id' (meninggikan fondasi-fondasi) menjadi bukti linguistik dalam Al-Qur'an bahwa jejak fondasi Ka'bah memang sudah tertanam sebelum masa Nabi Ibrahim AS.",
        },
      ],
    },
  ],
};
