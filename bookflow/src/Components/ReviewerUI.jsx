import React, { useEffect, useState } from 'react';
import { CheckCircle, FileText, AlertCircle, MessageSquare, Save, Eye, User, LogOut, RefreshCw, Star, Clock, Edit3 } from 'lucide-react';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const ReviewerUI = ({ user, onLogout }) => {
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const chaptersRef = ref(db, 'chapters/');
    onValue(chaptersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setChapters(list);
    });
  }, []);

  const handleSaveReview = async () => {
    if (!selected) return;
    setIsLoading(true);
    
    const db = getDatabase();
    const chapterRef = ref(db, `chapters/${selected.id}`);
    await set(chapterRef, {
      ...selected,
      reviewerVersion: reviewText,
      reviewerFeedback: feedbackText,
      status: 'reviewed',
    });

    setIsLoading(false);
    // Show success feedback
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg z-50';
    successDiv.textContent = 'Review submitted successfully!';
    document.body.appendChild(successDiv);
    setTimeout(() => document.body.removeChild(successDiv), 3000);
  };

  const writerApprovedChapters = chapters.filter(ch => ch.status === 'writer_approved');

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
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Reviewer Dashboard
                  </h1>
                  <p className="text-sm text-gray-400">Quality Assurance & Content Review</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm">Welcome, {user?.name || 'Reviewer'}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">Logout</span>
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
                    Chapters for Review
                  </h2>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="text-blue-400 text-xs">{writerApprovedChapters.length} Pending</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {writerApprovedChapters.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No chapters pending review</p>
                      <p className="text-xs">All chapters are either in progress or completed</p>
                    </div>
                  ) : (
                    writerApprovedChapters.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          setSelected(ch);
                          setReviewText(ch.writerText || '');
                          setFeedbackText(ch.reviewerFeedback || '');
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selected?.id === ch.id
                            ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">
                            {(ch.chapter && ch.chapter.split('/').pop()) || ch.title || 'Untitled Chapter'}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-400">Review</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Writer Approved</span>
                          <span className="text-blue-400">● Pending</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Review Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Quality Review
                  </h2>
                  {selected && (
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="text-yellow-400 text-xs">Under Review</span>
                    </div>
                  )}
                </div>

                {selected ? (
                  <div className="space-y-6">
                    {/* Chapter Title */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/30">
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">
                        {(selected.chapter && selected.chapter.split('/').pop()) || selected.title || 'Untitled Chapter'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>ID: {selected.id}</span>
                        <span>•</span>
                        <span>Status: Writer Approved</span>
                      </div>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* AI Version */}
                      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                          <h3 className="font-medium text-blue-300">AI Generated Version</h3>
                        </div>
                        <div className="text-sm text-blue-100 leading-relaxed max-h-48 overflow-y-auto bg-slate-900/30 rounded-lg p-3">
                          {selected.ai_version || 'No AI version available'}
                        </div>
                      </div>

                      {/* Writer Version */}
                      <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl p-4 border border-emerald-500/30">
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                          <h3 className="font-medium text-emerald-300">Writer's Version</h3>
                        </div>
                        <div className="text-sm text-emerald-100 leading-relaxed max-h-48 overflow-y-auto bg-slate-900/30 rounded-lg p-3">
                          {selected.writerText || 'No writer edits available'}
                        </div>
                      </div>
                    </div>

                    {/* Reviewer Editor */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                          <h3 className="font-medium text-blue-300">Your Review Edits</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Final review version</span>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <textarea
                        className="w-full h-48 p-4 rounded-lg bg-slate-900/50 border border-blue-500/30 text-white text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Make your final edits and improvements here..."
                      />
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                        <h3 className="font-medium text-yellow-300">Feedback & Comments</h3>
                      </div>
                      <textarea
                        className="w-full h-32 p-4 rounded-lg bg-slate-900/50 border border-yellow-500/30 text-white text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Provide feedback for the writer and future improvements..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-sm text-gray-400">
                        Ensure all edits are complete before submitting your review.
                      </div>
                      <button
                        onClick={handleSaveReview}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span className="font-medium">Submit Review</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No Chapter Selected</p>
                    <p className="text-sm">Choose a chapter from the list to start reviewing</p>
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

export default ReviewerUI;