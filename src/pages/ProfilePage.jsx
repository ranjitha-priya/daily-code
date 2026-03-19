import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserSubmissions = async () => {
            try {
                const { data } = await API.get('/submissions/user/me');
                setSubmissions(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load user submissions.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserSubmissions();
        }
    }, [user]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    if (!user) return null;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">👤 User Profile</h2>
            </div>

            <div className="profile-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(user.name || user.email)[0].toUpperCase()}
                </div>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{user.name || 'User'}</h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>{user.email}</p>
                    <span className="badge-topic" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Role: {user.role}</span>
                </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Your Past Submissions ({submissions.length})</h3>

            {loading && (
                <div className="loading-card">
                    <div className="loading-spinner" />
                    <p>Loading your history...</p>
                </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            {!loading && !error && submissions.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Submissions Found</h3>
                    <p>You haven't submitted any solutions yet. Go to the dashboard to start coding!</p>
                    <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Go to Dashboard</Link>
                </div>
            )}

            {!loading && submissions.length > 0 && (
                <div className="submissions-list">
                    {submissions.map((sub) => (
                        <div className="submission-item" key={sub._id}>
                            <div className="submission-item-header">
                                <div className="sub-user">
                                    <div>
                                        <div className="sub-email" style={{ fontWeight: 'bold' }}>{sub.questionId?.title || 'Unknown Question'}</div>
                                        <div className="sub-time">{formatDate(sub.createdAt)} • {sub.questionId?.topic}</div>
                                    </div>
                                </div>
                                <div className="sub-complexity-badges">
                                    <span className="complexity-badge time">⏱ {sub.timeComplexity}</span>
                                    <span className="complexity-badge space">💾 {sub.spaceComplexity}</span>
                                </div>
                            </div>
                            <pre className="code-block">{sub.code}</pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
