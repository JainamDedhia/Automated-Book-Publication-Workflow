import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { app } from './firebase';
import { FileText, PenTool, Brain, MessageSquare, Save, CheckCircle, Eye, Users, Award, BookOpen, Sparkles, Clock, Edit3, RefreshCw } from 'lucide-react';

const db = getDatabase(app);

const EditorUI = ({ user, onLogout }) => {
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [finalText, setFinalText] = useState('');
  const [rating, setRating] = useState(0);


  useEffect(() => {
    const chaptersRef = ref(db, 'chapters/');
    onValue(chaptersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setChapters(list);
    });
  }, []);

  const handlePublish = async () => {
    if (!selected) return;

    const chapterRef = ref(db, `chapters/${selected.id}`);
    await set(chapterRef, {
      ...selected,
      finalVersion: finalText,
      rating: rating,
      status: 'published',
    });

    alert('Chapter published successfully!');
  };

  const getChapterTitle = (chapter) => {
    return (chapter.chapter && chapter.chapter.split('/').pop()) || 
           chapter.title || 
           'Untitled Chapter';
  };

  const reviewedChapters = chapters.filter((ch) => ch.status === 'reviewed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Editor Dashboard
                  </h1>
                  <p className="text-sm text-gray-400">Final Review & Publishing</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-sm text-blue-300">Welcome, {user.name}</span>
                </div>
                <button 
                  onClick={onLogout} 
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-4 py-2 rounded-lg transition-all duration-200 text-red-300 hover:text-red-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chapter List */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Ready for Final Edit
                  </h2>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">{reviewedChapters.length} Ready</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {reviewedChapters.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No chapters ready</p>
                      <p className="text-xs">Waiting for reviewed content</p>
                    </div>
                  ) : (
                    reviewedChapters.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          setSelected(ch);
                          setFinalText(ch.finalVersion || ch.reviewerVersion || ch.writerText || '');
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selected?.id === ch.id
                            ? 'bg-blue-500/20 border-blue-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{getChapterTitle(ch)}</h3>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-400">Reviewed</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Ready for final edit</span>
                          <span className="text-blue-400">⏳ Pending</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Editing Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-blue-400" />
                    Final Editor Review
                  </h2>
                  {selected && (
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Ready to Publish</span>
                    </div>
                  )}
                </div>

                {selected ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-4 border border-blue-500/20">
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">
                        {getChapterTitle(selected)}
                      </h3>
                      <p className="text-sm text-gray-400">Chapter ID: {selected.id}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* AI Version */}
                      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
                        <div className="flex items-center mb-3">
                          <Brain className="w-4 h-4 text-blue-400 mr-2" />
                          <h4 className="font-medium text-blue-300">AI Version</h4>
                        </div>
                        <div className="text-sm text-blue-100 bg-slate-900/40 p-3 rounded-lg max-h-32 overflow-y-auto">
                          {selected.ai_version || 'No AI version available'}
                        </div>
                      </div>

                      {/* Writer Version */}
                      <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl p-4 border border-emerald-500/30">
                        <div className="flex items-center mb-3">
                          <PenTool className="w-4 h-4 text-emerald-400 mr-2" />
                          <h4 className="font-medium text-emerald-300">Writer's Version</h4>
                        </div>
                        <div className="text-sm text-emerald-100 bg-slate-900/40 p-3 rounded-lg max-h-32 overflow-y-auto">
                          {selected.writerText || 'No writer submission'}
                        </div>
                      </div>
                    </div>

                    {/* Reviewer Version */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
                      <div className="flex items-center mb-3">
                        <Eye className="w-4 h-4 text-blue-400 mr-2" />
                        <h4 className="font-medium text-blue-300">Reviewer's Version</h4>
                      </div>
                      <div className="text-sm text-blue-100 bg-slate-900/40 p-3 rounded-lg max-h-32 overflow-y-auto">
                        {selected.reviewerVersion || 'No reviewer edits'}
                      </div>
                    </div>

                    {/* Reviewer Feedback */}
                    <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
                      <div className="flex items-center mb-3">
                        <MessageSquare className="w-4 h-4 text-yellow-400 mr-2" />
                        <h4 className="font-medium text-yellow-300">Reviewer Feedback</h4>
                      </div>
                      <div className="text-sm text-yellow-100 bg-slate-900/40 p-3 rounded-lg">
                        {selected.reviewerFeedback || 'No feedback provided'}
                      </div>
                    </div>

                    {/* Final Editor Version */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-blue-400 mr-2" />
                          <h4 className="font-medium text-blue-300">Final Version (Editor)</h4>
                        </div>
                        <div className="text-xs text-blue-400">Ready for Publication</div>
                      </div>
                      <textarea
                        className="w-full h-48 p-4 rounded-lg bg-slate-900/60 border border-blue-500/30 text-blue-100 placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 resize-none"
                        value={finalText}
                        onChange={(e) => setFinalText(e.target.value)}
                        placeholder="Enter the final version of the chapter here..."
                      />
                    </div>

                    {/* Rating Input */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl p-4 border border-indigo-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 text-indigo-400 mr-2" />
                          <h4 className="font-medium text-indigo-300">Final Rating</h4>
                        </div>
                        <div className="text-xs text-indigo-400">Rate chapter quality</div>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border 
                              ${rating >= star
                                ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:text-indigo-200 hover:border-indigo-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Publish Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handlePublish}
                        className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Publish Final Chapter
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No Chapter Selected</p>
                    <p className="text-sm">Select a chapter from the sidebar to begin final editing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorUI;