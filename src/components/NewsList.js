import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NewsList.css";

const API_URL = "https://news-llm-generator.onrender.com/llm/news/";

function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setNewsList(response.data);
      } catch (error) {
        console.error("Error fetching news:", error.response || error.message);
        setError("تعذر تحميل الأخبار. يرجى المحاولة لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="loading">جاري تحميل الأخبار...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="news-list">
      <h1>قائمة الأخبار</h1>
      <table className="news-table">
        <thead>
          <tr>
            <th>#</th>
            <th>نوع الخبر</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news, index) => (
            <tr key={news.id}>
              <td>{index + 1}</td>
              <td>{news.news_type}</td>
              <td>
                <Link to={`/news/${news.id}`} className="view-btn">
                  عرض التفاصيل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewsList;
