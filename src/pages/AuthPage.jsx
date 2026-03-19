import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            return setError('Please fill in all fields.');
        }
        if (!isLogin && password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        setLoading(true);
        try {
            let userData;
            if (isLogin) {
                userData = await login(email, password);
            } else {
                if (!name.trim()) return setError('Please enter your name.');
                userData = await register(name, email, password);
            }
            navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">⚡</div>
                    <h1 className="auth-title">Daily Code Challenge</h1>
                    <p className="auth-subtitle">Sharpen your skills, one problem at a time.</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        Login
                    </button>
                    <button
                        className={`tab-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error">{error}</div>}

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p className="auth-switch">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        className="link-btn"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
