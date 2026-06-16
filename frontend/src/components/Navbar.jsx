import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Calendar size={20} />
          EventHub
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Events
            </NavLink>
          </li>
          
          {user ? (
            <>
              <li>
                <NavLink to="/my-registrations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  My Registrations
                </NavLink>
              </li>
              <li className="user-badge">
                <UserIcon size={14} />
                <span>{user.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <LogOut size={14} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Login
                </NavLink>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
          
          <li>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn" 
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
