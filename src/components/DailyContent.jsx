import { Clock, Book, Heart } from 'lucide-react';

const DailyContent = () => {
  // Mock Prayer Times
  const prayerTimes = {
    fajr: '05:30 AM',
    dhuhr: '12:45 PM',
    asr: '03:30 PM',
    maghrib: '06:15 PM',
    isha: '07:45 PM',
    nextPrayer: 'Dhuhr',
    nextPrayerTime: '12:45 PM',
    timeUntil: '2h 30m',
  };

  // Mock Qur'an Verse
  const quranVerse = {
    surah: 'Al-Fatiha',
    ayah: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    meaning: 'This is the opening of the Quran and the foundation of all Islamic teachings.',
  };

  // Mock Adhkar/Duas
  const adhkar = [
    { id: 1, title: 'Subhanallah', count: 33, translation: 'Glory be to Allah' },
    { id: 2, title: 'Alhamdulillah', count: 33, translation: 'All praise is due to Allah' },
    { id: 3, title: 'Allahu Akbar', count: 34, translation: 'Allah is the Greatest' },
  ];

  const duas = [
    { id: 1, title: 'Dua for Forgiveness', arabic: 'استغفر الله العظيم' },
    { id: 2, title: 'Dua for Protection', arabic: 'أعوذ بالله من الشيطان الرجيم' },
    { id: 3, title: 'Dua for Guidance', arabic: 'اللهم اهدنا إلى أقوم الطريق' },
  ];

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-emerald-900 mb-6">Daily Spiritual Content</h2>

      {/* Prayer Times Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-emerald-700" />
          <h3 className="text-lg font-semibold text-gray-800">Prayer Times</h3>
        </div>

        {/* Next Prayer Highlight */}
        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-emerald-700">
          <p className="text-sm text-gray-600">Next Prayer</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-700">{prayerTimes.nextPrayer}</span>
            <span className="text-lg text-gray-700">{prayerTimes.nextPrayerTime}</span>
            <span className="text-sm text-gray-500">({prayerTimes.timeUntil})</span>
          </div>
        </div>

        {/* All Prayer Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'Fajr', time: prayerTimes.fajr },
            { name: 'Dhuhr', time: prayerTimes.dhuhr },
            { name: 'Asr', time: prayerTimes.asr },
            { name: 'Maghrib', time: prayerTimes.maghrib },
            { name: 'Isha', time: prayerTimes.isha },
          ].map((prayer) => (
            <div
              key={prayer.name}
              className="bg-white rounded-md p-3 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-700">{prayer.name}</p>
              <p className="text-lg font-semibold text-emerald-600">{prayer.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Qur'an Reading Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5 text-emerald-700" />
          <h3 className="text-lg font-semibold text-gray-800">Today's Qur'an Reading</h3>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-emerald-700">
          <p className="text-sm text-gray-600 mb-3">
            {quranVerse.surah} - Ayah {quranVerse.ayah}
          </p>

          {/* Arabic Text */}
          <p className="text-2xl text-right font-semibold text-gray-800 mb-4 leading-loose">
            {quranVerse.arabic}
          </p>

          {/* English Translation */}
          <p className="text-md text-gray-700 mb-3">
            <span className="font-semibold">Translation:</span> "{quranVerse.translation}"
          </p>

          {/* Meaning */}
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Meaning:</span> {quranVerse.meaning}
          </p>
        </div>
      </div>

      {/* Adhkar & Duas Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-emerald-700" />
          <h3 className="text-lg font-semibold text-gray-800">Daily Adhkar & Duas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Adhkar */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">Adhkar</h4>
            <div className="space-y-2">
              {adhkar.map((item) => (
                <div key={item.id} className="p-3 bg-emerald-50 rounded-md hover:bg-emerald-100 transition cursor-pointer">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-600">
                    {item.translation} × {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Duas */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">Duas</h4>
            <div className="space-y-2">
              {duas.map((item) => (
                <div key={item.id} className="p-3 bg-emerald-50 rounded-md hover:bg-emerald-100 transition cursor-pointer">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-700 text-right">{item.arabic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyContent;
