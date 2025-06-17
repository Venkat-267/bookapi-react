import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await authService.register({
        userName,
        password,
        role,
      });
      alert(data.Message || 'Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'Admin':
        return 'Full access to manage books and users';
      case 'Author':
        return 'Can manage own books and view others';
      case 'User':
      default:
        return 'Can view books in the library';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card bounce-in">
        <h2 className="auth-title">📝 Create Account</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              placeholder="Choose a username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="User">👤 User</option>
              <option value="Admin">👑 Admin</option>
              <option value="Author">✍️ Author</option>
            </select>
            <small className="text-muted mt-1 d-block">
              {getRoleDescription(role)}
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? '🔄 Creating Account...' : '🎉 Create Account'}
          </button>
          
          <div className="text-center mt-3">
            <p className="text-muted">
              Already have an account? <Link to="/login" className="text-primary">Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;