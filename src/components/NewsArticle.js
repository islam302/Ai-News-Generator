import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
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
            const payload = {
                id: article.id,
                news_type: article.news_type || "Default News Type",
                details: editorContent,
            };

            console.log("Payload being sent:", payload);

            const response = await axios.put(
                `http://127.0.0.1:8000/llm/news/${id}/`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log("Response from backend:", response.data);
            alert("تم حفظ الخبر بنجاح...");

        } catch (error) {
            if (error.response) {
                console.error("Backend error:", error.response.data);
                alert(`Error saving article: ${error.response.data.message || "Unknown error."}`);
            } else {
                console.error("Error saving article:", error.message);
                alert("Error saving article. Please check your network or backend.");
            }
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
                <Editor
                    apiKey="3aa76efj97gqybphmadxgq9afo814b3rdbn4mp5fa8ueechr" // Replace with your TinyMCE API key if needed
                    value={editorContent}
                    onEditorChange={(content) => setEditorContent(content)}
                    init={{
                        height: 200,
                        menubar: false,
                        plugins: ['link', 'image', 'media', 'textcolor', 'lists'],
                        toolbar: `
                            bold italic | 
                            fontsizeselect forecolor backcolor | 
                            link image media | 
                            alignleft aligncenter alignright alignjustify
                        `,
                        directionality: 'rtl',
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
