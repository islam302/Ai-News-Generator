import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NewsList.css";

const API_URL = "http://127.0.0.1:8000/llm/news/";

function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news list
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

  // Delete news
  const deleteNews = async (id) => {
    if (window.confirm("هل تريد حذف هذا الخبر؟")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        // Remove deleted news from the list
        setNewsList((prevNews) => prevNews.filter((news) => news.id !== id));
      } catch (error) {
        console.error("Error deleting news:", error.response || error.message);
        alert("تعذر حذف الخبر. يرجى المحاولة لاحقًا.");
      }
    }
  };

  if (loading) return <p className="loading">جاري تحميل الأخبار...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="news-list">
      <h1>قائمة الأخبار</h1>
      <table className="news-table">
        <thead>
          <tr>
            <th>رقم الخبر</th>
            <th>نوع الخبر</th>
            <th>العرض</th>
            <th>الإجراء</th>
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
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteNews(news.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewsList;
