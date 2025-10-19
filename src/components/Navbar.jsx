import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navbar">
      <div className="navbar-container">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <span className="nav-label">WORK</span>
          <img src="/images/ui/yuwon_work_icon.png" alt="Work" className="nav-icon" />
        </Link>

        <Link to="/record" className={`nav-item ${isActive('/record') ? 'active' : ''}`}>
          <span className="nav-label">DIARY</span>
          <img src="/images/ui/minkyu_record_icon.png" alt="Diary" className="nav-icon" />
        </Link>

        <Link to="/company" className={`nav-item ${isActive('/company') ? 'active' : ''}`}>
          <span className="nav-label">COMPANY</span>
          <img src="/images/ui/bigger/noah_rewards.png" alt="Company" className="nav-icon" />
        </Link>

        <Link to="/story" className={`nav-item ${isActive('/story') ? 'active' : ''}`}>
          <span className="nav-label">STORY</span>
          <img src="/images/ui/yuwon_storyicon.png" alt="Story" className="nav-icon" />
        </Link>

        <Link to="/room" className={`nav-item ${isActive('/room') ? 'active' : ''}`}>
          <span className="nav-label">ROOM</span>
          <img src="/images/ui/yuwon_vanity_icon.png" alt="Room" className="nav-icon" />
        </Link>

        <Link to="/selfcare" className={`nav-item ${isActive('/selfcare') ? 'active' : ''}`}>
          <span className="nav-label">SELF CARE</span>
          <img src="/images/ui/jaehyun_selfcare_icon.png" alt="Self Care" className="nav-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
