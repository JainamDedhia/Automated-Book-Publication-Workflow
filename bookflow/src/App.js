import React, { useState } from 'react';
import Login from './Components/Login';
import UserUI from './Components/UserUI';
import WriterUI from './Components/WriterUI';
import ReviewerUI from './Components/ReviewerUI';
import EditorUI from './Components/EditorUI';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  switch (currentUser.role) {
    case 'user':
      return <UserUI user={currentUser} onLogout={handleLogout} />;
    case 'writer':
      return <WriterUI user={currentUser} onLogout={handleLogout} />;
    case 'reviewer':
      return <ReviewerUI user={currentUser} onLogout={handleLogout} />;
    case 'editor':
      return <EditorUI user={currentUser} onLogout={handleLogout} />;
    default:
      return <Login onLogin={handleLogin} />;
  }
}

export default App;