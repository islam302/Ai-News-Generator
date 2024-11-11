import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './NewsArticle.css';

function NewsArticle() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`https://news-llm-generator.onrender.com/llm/news/${id}/`);
                console.log(response.data);
                setArticle(response.data);
            } catch (error) {
                console.error("Error fetching article:", error.response ? error.response.data : error.message);
                setError("تعذر تحميل الخبر. يرجى المحاولة لاحقًا.");
            }
        };

        fetchArticle();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!article) {
        return <p className="loading">جاري تحميل الخبر...</p>;
    }

    return (
        <div className="news-article">
            <div className="header">
                {article.date && <p className="date">{article.date}</p>}
            </div>
            <div className="content">
                <p className="details">{article.details}</p>
            </div>
        </div>
    );
}

export default NewsArticle;
