import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Diary from './components/Diary';
import Questionnaire from './components/Questionnaire';
import MoodAnalysis from './components/MoodAnalysis';
import TrackMood from './components/TrackMood';
import Memories from './components/Memories';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect dashboard to home OR use a dedicated view */}
        <Route path="/dashboard" element={<Navigate to="/home" />} />

        {/* Standalone pages wrapped in Layout */}
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/diary" element={<Layout><Diary /></Layout>} />
        <Route path="/questionnaire" element={<Layout><Questionnaire /></Layout>} />
        
        {/* Mood Analysis Page */}
        <Route path="/mood-analysis" element={<Layout><MoodAnalysis mood={localStorage.getItem('selectedMood')} /></Layout>} />
        
        <Route path="/track-mood" element={<Layout><TrackMood /></Layout>} />
        <Route path="/memories" element={<Layout><Memories /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
