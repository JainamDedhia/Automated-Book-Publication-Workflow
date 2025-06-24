import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebase';
import { BookOpen } from 'lucide-react';

const db = getDatabase(app);

const ReaderUI = () => {
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const chaptersRef = ref(db, 'chapters/');
    onValue(chaptersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const published = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .filter((ch) => ch.status === 'published');
      setChapters(published);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-6">
      <header className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-emerald-400" />
        <h1 className="text-xl font-bold">Published Chapters</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chapter List */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Available</h2>
          {chapters.map((ch) => (
            <div
              key={ch.id}
              onClick={() => setSelected(ch)}
              className={`cursor-pointer p-3 rounded mb-2 border hover:bg-emerald-500/20 ${
                selected?.id === ch.id ? 'bg-emerald-500/10' : 'bg-white/10'
              }`}
            >
              <p className="font-medium">{ch.chapter?.split('/').pop() || 'Untitled'}</p>
              <p className="text-xs text-gray-300">{ch.timestamp?.split('T')[0]}</p>
            </div>
          ))}
        </div>

        {/* Chapter Reader */}
        {selected && (
          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">{selected.chapter}</h2>
            <div className="text-sm text-gray-100 whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
              {selected.finalVersion || 'No content available.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderUI;
