import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
    const [question, setQuestion] = useState(null);
    const [qLoading, setQLoading] = useState(true);
    const [qError, setQError] = useState('');

    const [code, setCode] = useState('');
    const [timeComplexity, setTimeComplexity] = useState('');
    const [spaceComplexity, setSpaceComplexity] = useState('');
    const [subError, setSubError] = useState('');
    const [subSuccess, setSubSuccess] = useState('');
    const [subLoading, setSubLoading] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await API.get('/question/today');
                setQuestion(data);
            } catch (err) {
                setQError(err.response?.data?.message || 'Failed to load today\'s question.');
            } finally {
                setQLoading(false);
            }
        };
        fetchQuestion();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubError('');
        setSubSuccess('');

        if (!code.trim()) return setSubError('Code cannot be empty.');
        if (!timeComplexity.trim()) return setSubError('Please enter time complexity.');
        if (!spaceComplexity.trim()) return setSubError('Please enter space complexity.');

        setSubLoading(true);
        try {
            await API.post('/submissions', {
                questionId: question._id,
                code,
                timeComplexity,
                spaceComplexity,
            });
            setSubSuccess('✅ Submission successful!');
            setCode('');
            setTimeComplexity('');
            setSpaceComplexity('');
        } catch (err) {
            setSubError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setSubLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">📅 Today's Challenge</h2>
                {question && (
                    <Link to="/submissions" className="btn-secondary">
                        View All Submissions
                    </Link>
                )}
            </div>

            {qLoading && (
                <div className="loading-card">
                    <div className="loading-spinner" />
                    <p>Loading today's question...</p>
                </div>
            )}

            {qError && (
                <div className="empty-state">
                    <div className="empty-icon">🤔</div>
                    <h3>No Challenge Yet</h3>
                    <p>{qError}</p>
                    <p className="empty-hint">Check back soon — the admin will post today's challenge shortly.</p>
                </div>
            )}

            {question && !qLoading && (
                <>
                    {/* Question Card */}
                    <div className="question-card">
                        <div className="question-badge">{question.topic}</div>
                        <h2 className="question-title">{question.title}</h2>
                        <div className="question-divider" />
                        <p className="question-description">{question.description}</p>

                        {question.leetcodeLink && (
                            <a
                                href={question.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-leetcode"
                            >
                                <span>🔗</span> Solve on LeetCode
                            </a>
                        )}
                    </div>

                    {/* Submission Form */}
                    <div className="submission-card">
                        <h3 className="section-title">📝 Submit Your Solution</h3>
                        <form onSubmit={handleSubmit} className="submission-form">
                            {subError && <div className="alert alert-error">{subError}</div>}
                            {subSuccess && <div className="alert alert-success">{subSuccess}</div>}

                            <div className="form-group">
                                <label htmlFor="code">Your Code</label>
                                <textarea
                                    id="code"
                                    className="code-editor"
                                    placeholder="// Write your solution here..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    rows={14}
                                    spellCheck={false}
                                />
                            </div>

                            <div className="complexity-row">
                                <div className="form-group">
                                    <label htmlFor="timeComplexity">⏱ Time Complexity</label>
                                    <input
                                        id="timeComplexity"
                                        type="text"
                                        placeholder="e.g. O(n log n)"
                                        value={timeComplexity}
                                        onChange={(e) => setTimeComplexity(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="spaceComplexity">💾 Space Complexity</label>
                                    <input
                                        id="spaceComplexity"
                                        type="text"
                                        placeholder="e.g. O(n)"
                                        value={spaceComplexity}
                                        onChange={(e) => setSpaceComplexity(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={subLoading}>
                                {subLoading ? <span className="spinner" /> : '🚀 Submit Solution'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
