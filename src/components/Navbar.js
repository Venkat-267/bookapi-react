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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Book Manager</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/books">Books</Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="nav-link disabled">Welcome, {user?.Role}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm me-2" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>
              </li>
              
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
