// src/Home.jsx
import { Link } from 'react-router-dom';
import '../Home.css'; // Make sure the path is correct

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to EmoScrap</h1>
      <p>Track and reflect on your emotions!</p>
      <div className="home-buttons">
       
         <Link to="/diary" className="home-btn">Diary</Link> 
        <Link to="/questionnaire" className="home-btn">Start Questionnaire</Link>
        <Link to="/mood-analysis" className="home-btn">View Mood Analysis</Link>
        <Link to="/track-mood" className="home-btn">Track Your Mood</Link>
      </div>
    </div>
  );
}

export default Home;
