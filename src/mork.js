// src/mockData/mosques.js
export const mosques = [
  {
    id: "1",
    name: "Masjid Umar Bin Khattab",
    country: "Nigeria",
    state: "Kano",
    is_verified: true,
    description: "Weekly Tafseer and Fiqh lessons",
    categories: [
      {
        id: "c1",
        name: "Tafseer",
        lectures: [
          {
            id: "l1",
            title: "Tafseer of Surah Al-Baqarah",
            teacher_name: "Sheikh Ali",
            lecture_date: "2025-12-20",
            media_type: "VIDEO",
            media_url: "https://www.example.com/video1.mp4"
          },
          {
            id: "l2",
            title: "Tafseer of Surah Yaseen",
            teacher_name: "Sheikh Ali",
            lecture_date: "2025-12-22",
            media_type: "AUDIO",
            media_url: "https://www.example.com/audio1.mp3"
          }
        ]
      },
      {
        id: "c2",
        name: "Hadith",
        lectures: [
          {
            id: "l3",
            title: "Hadith on Patience",
            teacher_name: "Sheikh Umar",
            lecture_date: "2025-12-23",
            media_type: "VIDEO",
            media_url: "https://www.example.com/video2.mp4"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Masjid Al-Farooq",
    country: "Nigeria",
    state: "Lagos",
    is_verified: false,
    description: "Daily Quran and Hadith lessons",
    categories: []
  }
];
