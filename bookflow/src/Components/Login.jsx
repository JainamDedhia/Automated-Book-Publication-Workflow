import React, { useState } from 'react';
import { User, Lock, BookOpen } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const users = {
    'user': { password: '123', role: 'user', name: 'User' },
    'writer': { password: '123', role: 'writer', name: 'Writer' },
    'reviewer': { password: '123', role: 'reviewer', name: 'Reviewer' },
    'editor': { password: '123', role: 'editor', name: 'Editor' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (users[username] && users[username].password === password) {
      onLogin(users[username]);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg w-fit mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AI Book Workflow</h1>
          <p className="text-gray-400">Login to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (user/writer/reviewer/editor)"
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (123)"
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium py-3 rounded-lg transition-all duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="bg-white/5 rounded p-2">
              <div className="text-blue-400">User: user</div>
              <div className="text-gray-400">Pass: 123</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-emerald-400">Writer: writer</div>
              <div className="text-gray-400">Pass: 123</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-yellow-400">Reviewer: reviewer</div>
              <div className="text-gray-400">Pass: 123</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <div className="text-cyan-400">Editor: editor</div>
              <div className="text-gray-400">Pass: 123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;