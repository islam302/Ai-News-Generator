import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import NewsArticle from './NewsArticle';

function MainForm() {
    const [newsType, setNewsType] = useState('');
    const [what, setWhat] = useState('');
    const [who, setWho] = useState('');
    const [where, setWhere] = useState('');
    const [when, setWhen] = useState('');
    const [how, setHow] = useState('');
    const [why, setWhy] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // loading state
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "News Creator";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);  // Reset any previous error
        setLoading(true);  // Start loading

        try {
            // Prepare the data to send in the correct format
            const data = {
                news_type: newsType,
                what: what,
                who: who,
                where: where,
                when: when,
                how: how,
                why: why,
            };

            const result = await axios.post('https://news-llm-generator.onrender.com/llm/create/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Extract the article ID from the response URL
            const articleId = result.data.url.split('/')[3]; // Extract the ID from /news/123/

            setLoading(false);  // Stop loading after getting the response

            // Redirect to the created article page
            navigate(`/news/${articleId}`);
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            setError("حدث خطأ، يرجى المحاولة لاحقًا.");
            setLoading(false);  // Stop loading in case of error
        }
    };

    return (
        <div className="ai-app-background">
            <div className="overlay"></div>
            <h2 className="title">AI NEWS GENERATOR</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>نوع الخبر</label>
                    <select
                        value={newsType}
                        onChange={(e) => setNewsType(e.target.value)}
                        required
                        className="select-input"
                    >
                        <option value="">اختر نوع الخبر</option>
                        <option value="زيارة">زيارة</option>
                        <option value="حدث">حدث</option>
                        <option value="خبر عاجل">خبر عاجل</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>ماذا حدث؟</label>
                    <input
                        type="text"
                        value={what}
                        onChange={(e) => setWhat(e.target.value)}
                        placeholder="وصف الحدث"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>من شارك في الحدث؟</label>
                    <input
                        type="text"
                        value={who}
                        onChange={(e) => setWho(e.target.value)}
                        placeholder="الشخصيات أو الجهات المشاركة"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>أين وقع الحدث؟</label>
                    <input
                        type="text"
                        value={where}
                        onChange={(e) => setWhere(e.target.value)}
                        placeholder="المكان"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>متى وقع الحدث؟</label>
                    <input
                        type="text"
                        value={when}
                        onChange={(e) => setWhen(e.target.value)}
                        placeholder="الزمان"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>كيف وقع الحدث؟</label>
                    <input
                        type="text"
                        value={how}
                        onChange={(e) => setHow(e.target.value)}
                        placeholder="الطريقة - إذا كانت متوفرة"
                    />
                </div>
                <div className="form-group">
                    <label>لماذا وقع الحدث؟</label>
                    <input
                        type="text"
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        placeholder="السبب أو الخلفية - إذا كانت متوفرة"
                    />
                </div>
                <button type="submit" className="submit-btn">إنشاء الخبر</button>
            </form>

            {/* Show loading spinner if loading is true */}
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>جارٍ إنشاء الخبر...</p>
                </div>
            )}

            {error && (
                <div className="response-box">
                    <p className="error">{error}</p>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainForm />} />
                <Route path="/news/:id" element={<NewsArticle />} />
            </Routes>
        </Router>
    );
}

export default App;
