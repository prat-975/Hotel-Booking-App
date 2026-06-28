import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🏨</span>
          StayEase
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/bookings" className={isActive('/bookings') ? 'active' : ''}>
              My Bookings
            </Link>
          )}
          {!loading && (
            isAuthenticated ? (
              <div className="nav-user">
                {user?.profileImageUrl && (
                  <img src={user.profileImageUrl} alt="" className="nav-avatar" />
                )}
                <span className="nav-username">{user?.name}</span>
                <button type="button" className="nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
