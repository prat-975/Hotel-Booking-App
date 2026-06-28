import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from
    ? `${from.pathname}${from.search || ''}`
    : '/';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password, form.phone);
        setSuccess(`Welcome! We've sent a welcome email to ${form.email}.`);
        setTimeout(() => navigate(redirectTo, { replace: true }), 2500);
      } else {
        await login(form.email, form.password);
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setError('');
    setSubmitting(true);
    try {
      await googleLogin(response.credential);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="subtitle">
          {isRegister
            ? 'Sign up to book hotels and manage your reservations'
            : 'Sign in to book hotels and view your bookings'}
        </p>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in was cancelled or failed.')}
            theme="outline"
            size="large"
            width="100%"
            text={isRegister ? 'signup_with' : 'signin_with'}
          />
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Full Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder={isRegister ? 'At least 6 characters' : 'Your password'}
            />
          </label>
          {isRegister && (
            <label>
              Phone (optional)
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </label>
          )}

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={submitting || success}>
            {submitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <Link to="/" className="back-link auth-back">← Back to hotels</Link>
      </div>
    </div>
  );
}
