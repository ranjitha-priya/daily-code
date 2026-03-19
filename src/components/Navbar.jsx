import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}>
                    <span className="brand-icon">⚡</span>
                    <span className="brand-text">Daily Code Challenge</span>
                </Link>
            </div>

            <div className="navbar-right">
                <button className="nav-link theme-toggle" onClick={toggleTheme} title="Toggle Theme" style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontSize: '1.2rem', padding: '0.2rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                {user && (
                    <>
                        <span className="navbar-email">{user.name || user.email}</span>
                        {user.role === 'student' && (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/submissions" className="nav-link">Submissions</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin" className="nav-link">Admin Panel</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>
                            </>
                        )}
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
