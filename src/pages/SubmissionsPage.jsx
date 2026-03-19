import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const SubmissionsPage = () => {
    const [question, setQuestion] = useState(null);
    const [history, setHistory] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data: qs } = await API.get('/question/history');
                setHistory(qs);
                if (qs.length > 0) {
                    setQuestion(qs[0]);
                    const { data: subs } = await API.get(`/submissions/${qs[0]._id}`);
                    setSubmissions(subs);
                } else {
                    setError('No active challenges found.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load submissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const fetchSubmissionsForQuestion = async (selectedQuestionId) => {
        setLoading(true);
        setError('');
        try {
            const selectedQ = history.find(q => q._id === selectedQuestionId);
            setQuestion(selectedQ);
            const { data: subs } = await API.get(`/submissions/${selectedQuestionId}`);
            setSubmissions(subs);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/dashboard" style={{ padding: '0.4rem 0.8rem', textDecoration: 'none', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        &larr; Back to Question
                    </Link>
                    <h2 className="page-title" style={{ margin: 0 }}>🏆 Community Submissions</h2>
                </div>
                
                {history.length > 0 && (
                    <select 
                        className="day-selector"
                        value={question?._id || ''} 
                        onChange={(e) => fetchSubmissionsForQuestion(e.target.value)}
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        {history.map(q => (
                            <option key={q._id} value={q._id}>
                                {q.date} - {q.topic}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            
            {question && (
                <div className="question-meta-badge" style={{ marginBottom: '2rem' }}>
                    <span className="badge-topic">{question.topic}</span>
                    <span className="badge-title">{question.title}</span>
                </div>
            )}

            {loading && (
                <div className="loading-card">
                    <div className="loading-spinner" />
                    <p>Loading submissions...</p>
                </div>
            )}

            {error && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No Submissions Yet</h3>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && submissions.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🧑‍💻</div>
                    <h3>Be the first to submit!</h3>
                    <p>No one has solved today's challenge yet. Go ahead and submit your solution.</p>
                </div>
            )}

            {!loading && submissions.length > 0 && (
                <div className="submissions-count">
                    <span>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
                </div>
            )}

            <div className="submissions-list">
                {submissions.map((sub, index) => (
                    <div className="submission-item" key={sub._id}>
                        <div className="submission-item-header">
                            <div className="sub-user">
                                <div className="avatar">{(sub.userId?.name || sub.userId?.email)?.[0]?.toUpperCase() || '?'}</div>
                                <div>
                                    <div className="sub-email">{sub.userId?.name || sub.userId?.email || 'Unknown'}</div>
                                    <div className="sub-time">{formatDate(sub.createdAt)}</div>
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
        </div>
    );
};

export default SubmissionsPage;
