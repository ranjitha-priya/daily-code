import { useState } from 'react';
import API from '../api/axios';

const AdminPage = () => {
    const [topic, setTopic] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [leetcodeLink, setLeetcodeLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!topic.trim() || !title.trim() || !description.trim()) {
            return setError('Topic, title, and description are required.');
        }

        if (leetcodeLink && !/^https?:\/\//i.test(leetcodeLink)) {
            return setError('LeetCode link must be a valid URL starting with http:// or https://');
        }

        setLoading(true);
        try {
            const { data } = await API.post('/admin/question', {
                topic,
                title,
                description,
                leetcodeLink,
            });
            setSuccess(`✅ "${data.question.title}" is now today's active challenge!`);
            setTopic('');
            setTitle('');
            setDescription('');
            setLeetcodeLink('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post question.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">🛠️ Admin Panel</h2>
                <p className="page-subtitle">Post today's coding challenge for all students.</p>
            </div>

            <div className="admin-card">
                <h3 className="section-title">Post a New Question</h3>
                <p className="admin-note">
                    ℹ️ Posting a new question will automatically deactivate the previous one.
                </p>

                <form onSubmit={handleSubmit} className="admin-form">
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="topic">Topic <span className="required">*</span></label>
                        <input
                            id="topic"
                            type="text"
                            placeholder="e.g. Arrays, Dynamic Programming, Trees"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Question Title <span className="required">*</span></label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Two Sum"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description <span className="required">*</span></label>
                        <textarea
                            id="description"
                            placeholder="Write the full problem statement here..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={8}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="leetcodeLink">
                            LeetCode Link <span className="optional">(optional)</span>
                        </label>
                        <input
                            id="leetcodeLink"
                            type="url"
                            placeholder="https://leetcode.com/problems/..."
                            value={leetcodeLink}
                            onChange={(e) => setLeetcodeLink(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : '📤 Publish Challenge'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;
