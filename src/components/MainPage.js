import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import './MainPage.css';
import NewsList from "./NewsList";
import NewsArticle from './NewsArticle.js';
import ManageTemplates from './ManageTemplates.js'

function MainForm() {
    const [newsType, setNewsType] = useState('');
    const [what, setWhat] = useState('');
    const [who, setWho] = useState('');
    const [where, setWhere] = useState('');
    const [when, setWhen] = useState('');
    const [how, setHow] = useState('');
    const [why, setWhy] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "News Creator";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = {
                news_type: newsType,
                place: what,
                source: who,
                event: where,
                date: when,
                participants: how,
                event_details: why,
            };

            const result = await axios.post('https://news-llm-generator.onrender.com/llm/create/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const articleId = result.data.id;
            setLoading(false);
            navigate(`/news/${articleId}`); // Redirect to the news article page

        } catch (error) {
            console.error("Error details:", error.response ? error.response.data : error.message);
            setError("حدث خطأ، يرجى المحاولة لاحقًا.");
            setLoading(false);
        }
    };

    return (
        <div className="ai-app-background">
            <div className="overlay"></div>
            <h2 className="title">AI NEWS GENERATOR</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <select
                        value={newsType}
                        onChange={(e) => setNewsType(e.target.value)}
                        required
                        className="select-input"
                    >
                        <option value="">اختر نوع الخبر</option>
                        <option value="زيارة">زيارة</option>
                        <option value="عقد مؤتمر">عقد مؤتمر</option>
                        <option value="عقد ورشة عمل">عقد ورشة عمل</option>
                        <option value="إفتتاح وتدشين">إفتتاح وتدشين</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={what}
                        onChange={(e) => setWhat(e.target.value)}
                        placeholder="المكان"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={who}
                        onChange={(e) => setWho(e.target.value)}
                        placeholder="المصدر"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={where}
                        onChange={(e) => setWhere(e.target.value)}
                        placeholder="الحدث"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={when}
                        onChange={(e) => setWhen(e.target.value)}
                        placeholder="اليوم والتاريخ"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={how}
                        onChange={(e) => setHow(e.target.value)}
                        placeholder="المشاركون"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        placeholder="تفاصيل الحدث المتوفرة"
                    />
                </div>
                <button type="submit" className="submit-btn">إنشاء الخبر</button>
            </form>

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>جارٍ إنشاء الخبر...</p>
                </div>
            )}

            <button
                className="manage-templates-btn"
                onClick={() => navigate("/manage-templates/")}
            >
                Manage Templates
            </button>

            <button
                className="news"
                onClick={() => navigate("/news")}
            >
                News
            </button>

            {error && (
                <div className="response-box">
                    <p className="error">{error}</p>
                </div>
            )}
        </div>
    );
}

// App Component to route between MainForm and NewsArticle
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainForm/>}/>
                <Route path="/news" element={<NewsList />} />
                <Route path="/news/:id" element={<NewsArticle />} />
                <Route path="/manage-templates" element={<ManageTemplates />} />
            </Routes>
        </Router>
    );
}

export default App;
