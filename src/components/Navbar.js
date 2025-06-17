import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return '👑';
      case 'Author':
        return '✍️';
      case 'User':
      default:
        return '👤';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'status-admin';
      case 'Author':
        return 'status-author';
      case 'User':
      default:
        return 'status-user';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3">
      <Link className="navbar-brand" to="/">
        📚 Book Manager
      </Link>

      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/books">
                📖 My Books
              </Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item d-flex align-items-center me-3">
                <span className={`status-badge ${getRoleClass(user?.Role)}`}>
                  {getRoleIcon(user?.Role)} {user?.Role}
                </span>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm" 
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  🔐 Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm" to="/register">
                  📝 Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;