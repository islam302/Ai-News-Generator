import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './NewsArticle.css';

function NewsArticle() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/llm/news/${id}/`);
                setArticle(response.data);
                setEditorContent(response.data.details || '');
            } catch (error) {
                console.error("Error fetching article:", error.response ? error.response.data : error.message);
                setError("تعذر تحميل الخبر. يرجى المحاولة لاحقًا.");
            }
        };

        fetchArticle();
    }, [id]);

    const handleSave = async () => {
        try {
            const payload = { details: editorContent }; // Prepare payload
            const response = await axios.put(
                `http://127.0.0.1:8000/llm/news/${id}/`,
                payload,
                { headers: { 'Content-Type': 'application/json' } } // Set proper headers
            );
            alert("Article saved successfully!");
        } catch (error) {
            console.error("Error saving article:", error.response ? error.response.data : error.message);
            alert("Error saving article. Please try again.");
        }
    };

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
                <CKEditor
                    editor={ClassicEditor}
                    data={editorContent}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setEditorContent(data);
                    }}
                />
                <button className="save-button" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default NewsArticle;