import { Link, useNavigate } from 'react-router-dom';
import '../Layout.css'; // Make sure the path is correct

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div>
      <header className="navbar">
        <div className="brand">EmoScrap</div>
        <nav className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/diary">Diary</Link>
          <Link to="/questionnaire">Questionnaire</Link>
          <Link to="/mood-analysis">Mood Analysis</Link>
          <Link to="/track-mood">Track Mood</Link>
          {/* <Link to="/">Login</Link>
          <Link to="/register">Register</Link> */}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
