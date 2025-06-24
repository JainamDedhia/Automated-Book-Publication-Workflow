import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, Users, Eye, CheckCircle, XCircle, Edit3, Save, Download, Upload, RefreshCw, Sparkles, Brain, MessageSquare, FileText, Camera, Database, Search, Award, Clock, AlertCircle, Star, Filter, BookMarked } from 'lucide-react';
import { getDatabase, ref, onValue } from "firebase/database";

const UserUI = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chapterUrl, setChapterUrl] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [role, setRole] = useState("writer");
  const [apiUrl, setApiUrl] = useState("");
  const [error, setError] = useState("");
  const [iterations, setIterations] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [groupedBooks, setGroupedBooks] = useState({});
  const [expandedBooks, setExpandedBooks] = useState({});

  const steps = [
    { id: 1, name: "Content Scraping", icon: Camera, status: "completed" },
    { id: 2, name: "AI Processing", icon: Brain, status: "completed" },
    { id: 3, name: "Human Review", icon: Users, status: "active" },
    { id: 4, name: "Final Version", icon: CheckCircle, status: "pending" },
    { id: 5, name: "Publication", icon: Award, status: "pending" }
  ];

  const processingStages = [
    { name: "Scraping Content", duration: 10 },
    { name: "Taking Screenshot", duration: 15 },
    { name: "AI Writer - Cycle 1", duration: 30 },
    { name: "AI Reviewer - Cycle 1", duration: 25 },
    { name: "AI Writer - Cycle 2", duration: 30 },
    { name: "AI Reviewer - Cycle 2", duration: 25 },
    { name: "AI Writer - Cycle 3", duration: 30 },
    { name: "AI Reviewer - Cycle 3", duration: 25 },
    { name: "Finalizing", duration: 10 }
  ];

  // Helper function to extract book name from title
  const extractBookName = (title) => {
    if (!title) return "Unknown Book";
    
    // Try to extract book name before "Chapter" or similar keywords
    const patterns = [
      /^(.+?)\s+Chapter\s+/i,
      /^(.+?)\s+Ch\.\s+/i,
      /^(.+?)\s+Part\s+/i,
      /^(.+?):\s*/,
      /^(.+?)\s+-\s+/
    ];
    
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return title;
  };

  // Helper function to get best rated chapter for each unique chapter name
  const getBestRatedChapters = (chapters) => {
    const chapterGroups = {};
    
    chapters.forEach(chapter => {
      const key = chapter.title.toLowerCase();
      if (!chapterGroups[key] || chapter.rating > chapterGroups[key].rating) {
        chapterGroups[key] = chapter;
      }
    });
    
    return Object.values(chapterGroups);
  };

  // Group chapters by book name
  const groupChaptersByBook = (chapters) => {
    const grouped = {};
    
    chapters.forEach(chapter => {
      const bookName = extractBookName(chapter.title);
      if (!grouped[bookName]) {
        grouped[bookName] = [];
      }
      grouped[bookName].push(chapter);
    });
    
    // Sort chapters within each book and get best rated for duplicates
    Object.keys(grouped).forEach(bookName => {
      grouped[bookName] = getBestRatedChapters(grouped[bookName])
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    });
    
    return grouped;
  };

  // Filter chapters based on search
  const filterChapters = (chapters, query) => {
    if (!query.trim()) {
      return chapters.slice(0, 10); // Show latest 10 chapters by default
    }
    
    const lowercaseQuery = query.toLowerCase();
    return chapters.filter(chapter => {
      const bookName = extractBookName(chapter.title).toLowerCase();
      const chapterTitle = chapter.title.toLowerCase();
      
      return bookName.includes(lowercaseQuery) || chapterTitle.includes(lowercaseQuery);
    });
  };

  useEffect(() => {
    const db = getDatabase();
    const chaptersRef = ref(db, "chapters");

    onValue(chaptersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const publishedChapters = Object.entries(data)
          .filter(([_, ch]) => ch.status === "published")
          .map(([id, ch]) => ({
            id,
            title: ch.chapter || ch.book || ch.title || "Untitled Chapter",
            finalContent: ch.finalVersion || ch.writerText || ch.ai_version || "",
            originalContent: ch.content || "",
            iterations: ch.iterations || 3,
            rating: ch.rating || Math.floor(Math.random() * 2) + 4, // 4-5 rating
            status: ch.status,
            lastModified: ch.timestamp || new Date().toISOString(),
            bookName: extractBookName(ch.chapter || ch.book || ch.title || "Untitled Chapter")
          }))
          .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        setChapters(publishedChapters);
        setGroupedBooks(groupChaptersByBook(publishedChapters));
        setFilteredChapters(filterChapters(publishedChapters, searchQuery));
        
        // Auto-select latest chapter if none selected
        if (!selectedChapter && publishedChapters.length > 0) {
          setSelectedChapter(publishedChapters[0]);
        }
      }
    });
  }, []);

  // Update filtered chapters when search changes
  useEffect(() => {
    setFilteredChapters(filterChapters(chapters, searchQuery));
  }, [searchQuery, chapters]);

  const handleUrlSubmit = async () => {
    if (!chapterUrl.trim()) {
      setError("Please enter a chapter URL");
      return;
    }
    
    if (!apiUrl.trim()) {
      setError("Please enter your Ngrok API URL");
      return;
    }

    setIsProcessing(true);
    setError("");
    setProcessingStage("Initializing...");
    setProcessingProgress(0);

    try {
      console.log("🚀 Making API request to:", `${apiUrl}/generate`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
      setProcessingStage("🔍 Scraping content from URL...");
      
      const res = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify({ 
          url: chapterUrl,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      
      setProcessingStage("✅ Processing complete!");
      setProcessingProgress(100);

      const chapterData = {
        id: Date.now(),
        title: data.title || "Untitled Chapter",
        status: "published",
        originalContent: data.original || "No original content",
        aiVersion: data.ai_version || "No AI version available",
        finalContent: data.ai_version || "No AI version available",
        humanFeedback: "",
        iterations: iterations,
        rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
        lastModified: new Date().toISOString(),
        bookName: extractBookName(data.title || "Untitled Chapter")
      };

      setChapters(prev => [chapterData, ...prev]);
      setSelectedChapter(chapterData);
      setChapterUrl("");
      setError("");

    } catch (err) {
      console.error("❌ Full error details:", err);
      
      if (err.name === 'AbortError') {
        setError(`Request timed out. Try reducing iterations or check your API.`);
      } else if (err.message.includes('fetch')) {
        setError(`Connection failed: Check if your Ngrok URL is correct and API is running`);
      } else {
        setError(`API Error: ${err.message}`);
      }
    }

    setIsProcessing(false);
    setProcessingStage("");
    setProcessingProgress(0);
  };
  
  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      setSelectedChapter(prev => ({
        ...prev,
        humanFeedback: feedbackText,
        lastModified: new Date().toISOString()
      }));
      setFeedbackText("");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'active': return 'text-blue-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'active': return 'bg-blue-500/20 border-blue-500/30';
      case 'pending': return 'bg-gray-500/20 border-gray-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 5) return 'text-emerald-400';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3) return 'text-orange-400';
    return 'text-red-400';
  };

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 rounded-2xl p-8 border border-purple-500/30 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Processing Chapter</h3>
          <p className="text-purple-300 mb-4">{processingStage}</p>
          
          <div className="text-center">
            <div className="text-lg font-medium text-white mb-2">{processingStage}</div>
            <div className="text-sm text-gray-400">Please wait...</div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center text-blue-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="text-sm">Running {iterations} iteration{iterations > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          {iterations > 2 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <div className="flex items-center text-orange-300">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-xs">High iteration count may take 15+ minutes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {isProcessing && <LoadingScreen />}
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    AI Book Publication Workflow
                  </h1>
                  <p className="text-sm text-gray-400">Automated Content Processing & Human Review</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                  apiUrl ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    apiUrl ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></div>
                  <span className={`text-sm ${apiUrl ? 'text-emerald-400' : 'text-red-400'}`}>
                    {apiUrl ? 'API Connected' : 'API Not Set'}
                  </span>
                </div>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200">
                  <Database className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center p-3 rounded-xl border-2 ${getStatusBg(step.status)} transition-all duration-300`}>
                  <step.icon className={`w-6 h-6 ${getStatusColor(step.status)}`} />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${getStatusColor(step.status)}`}>{step.name}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 mx-6"></div>
                )}
              </div>
            ))}
          </div>

                      <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
              <h3 className="text-cyan-400 font-medium mb-2">⚙️ API Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="Enter your Ngrok URL (e.g., https://xxxx.ngrok-free.app)"
                  className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white"
                />
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-400">Iterations:</label>
                  <select
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value))}
                    className="bg-slate-800 border border-slate-600 text-white rounded px-3 py-2"
                  >
                    <option value={1}>1 (Fast - 2 min)</option>
                    <option value={2}>2 (Medium - 4 min)</option>
                    <option value={3}>3 (Slow - 6+ min)</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Higher iterations = better quality but much longer processing time</p>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={chapterUrl}
                onChange={(e) => setChapterUrl(e.target.value)}
                placeholder="Paste chapter URL (e.g. Wikisource)"
                className="flex-1 p-3 rounded bg-slate-800 border border-slate-600 text-white"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={isProcessing || !apiUrl.trim()}
                className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded text-white font-medium transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Generate Chapter"
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Chapter List with Search */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <BookMarked className="w-5 h-5 mr-2 text-blue-400" />
                    Library
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{chapters.length} chapters</span>
                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all">
                      <Upload className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                </div>
                
                {/* Search Box */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books or chapters..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredChapters.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      {searchQuery ? (
                        <>
                          <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No results for "{searchQuery}"</p>
                          <p className="text-xs">Try searching for book names</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No chapters yet</p>
                          <p className="text-xs">Generate your first chapter above</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      {!searchQuery && (
                        <div className="text-xs text-gray-400 mb-2 px-2">
                          📚 Latest Chapters ({filteredChapters.length} shown)
                        </div>
                      )}
                      {searchQuery && (
                        <div className="text-xs text-gray-400 mb-2 px-2">
                          🔍 Search Results ({filteredChapters.length} found)
                        </div>
                      )}
                      
                      {filteredChapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          onClick={() => setSelectedChapter(chapter)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            selectedChapter?.id === chapter.id
                              ? 'bg-blue-500/20 border-blue-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-400 mb-1">
                                📖 {chapter.bookName}
                              </div>
                              <h3 className="font-medium text-sm truncate">{chapter.title}</h3>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <Star className={`w-4 h-4 ${getRatingColor(chapter.rating)}`} />
                              <span className={`text-xs font-medium ${getRatingColor(chapter.rating)}`}>
                                {chapter.rating}/5
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(chapter.lastModified).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <RefreshCw className="w-3 h-3 mr-1" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Content Review */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-purple-400" />
                    Content Review
                  </h2>
                  {selectedChapter && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className={`w-5 h-5 ${getRatingColor(selectedChapter.rating)}`} />
                        <span className={`font-medium ${getRatingColor(selectedChapter.rating)}`}>
                          {selectedChapter.rating}/5
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                      </div>
                    </div>
                  )}
                </div>

                {selectedChapter ? (
                  <div className="mb-6">
                    {/* Chapter Info */}
                    <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-lg">{selectedChapter.title}</h3>
                        <div className="text-sm text-gray-400">
                          📖 {selectedChapter.bookName}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Last modified: {new Date(selectedChapter.lastModified).toLocaleString()}
                      </div>
                    </div>

                    {/* Final Published Content */}
                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/30">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                        <h3 className="font-medium text-purple-300">Final Published Version</h3>
                      </div>
                      <div className="text-sm text-purple-100 leading-relaxed max-h-96 overflow-y-auto">
                        {selectedChapter.finalContent || "No content available"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No Chapter Selected</p>
                    <p className="text-sm">Select a chapter from the library to start reviewing</p>
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

export default UserUI;