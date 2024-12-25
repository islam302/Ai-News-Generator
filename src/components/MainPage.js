import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import './MainPage.css';
import NewsList from "./NewsList";
import NewsArticle from './NewsArticle.js';
import ManageTemplates from './ManageTemplates.js';

function MainForm() {
    const [newsType, setNewsType] = useState('');
    const [what, setWhat] = useState('');
    const [who, setWho] = useState('');
    const [where, setWhere] = useState('');
    const [when, setWhen] = useState('');
    const [how, setHow] = useState('');
    const [why, setWhy] = useState('');
    const [creationType, setCreationType] = useState('template_only');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [templateFields, setTemplateFields] = useState([]); // فارغة في البداية
    const [dynamicFields, setDynamicFields] = useState({}); // فارغة في البداية
    const [templateId, setTemplateId] = useState('');
    const [templateLoading, setTemplateLoading] = useState(false);
    const baseFields = ['news_type', 'place', 'source', 'event', 'date', 'participants', 'event_details'];
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const data = {
            news_type: newsType,
            place: what,
            source: who,
            event: where,
            date: when,
            participants: how,
            event_details: why,
            additional_variables: dynamicFields,
            creation_type: creationType,
            template_id: templateId, // إضافة template_id هنا
        };

        try {
            const result = await axios.post('https://news-llm-generator.onrender.com/llm/create/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const articleId = result.data.id;
            setLoading(false);
            navigate(`/news/${articleId}`);
        } catch (error) {
            console.error("Error details:", error.response ? error.response.data : error.message);
            setError(error.response?.data?.detail || "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
            setLoading(false);
        }
    };

    const handleTemplateLoad = async () => {
        if (!templateId) {
            setError("يرجى إدخال رقم القالب.");
            return;
        }

        setTemplateLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://news-llm-generator.onrender.com/llm/manage-templates/${templateId}/`);
            const templateText = response.data.templates;

            // استخراج الحقول الديناميكية من القالب
            const allFields = extractFieldsFromTemplate(templateText);

            // تصفية الحقول الإضافية فقط
            const additionalFields = allFields.filter(field => !baseFields.includes(field));
            setTemplateFields(additionalFields);

            // إعداد الحقول الإضافية مع قيم فارغة
            const initialValues = {};
            additionalFields.forEach((field) => {
                initialValues[field] = ""; // تعيين قيم فارغة كافتراضية
            });
            setDynamicFields(initialValues); // تعيين الحقول الإضافية فقط
        } catch (error) {
            console.error("Error fetching template details:", error);
            setError("تعذر تحميل القالب. يرجى التحقق من رقم القالب والمحاولة مرة أخرى.");
        } finally {
            setTemplateLoading(false);
        }
    };

    const extractFieldsFromTemplate = (template) => {
        const regex = /{(\w+)}/g; // استخراج المتغيرات بين الأقواس `{}`
        const fields = [];
        let match;
        while ((match = regex.exec(template)) !== null) {
            fields.push(match[1]); // إضافة المتغير إلى القائمة
        }
        return fields;
    };

    return (
        <div className="ai-app-background">
            <div className="overlay"></div>
            <h2 className="title">AI NEWS GENERATOR</h2>
            <button
                className="manage-templates-btn"
                onClick={() => navigate("/manage-templates/")}
            >
                ادارة القوالب
            </button>

            <button
                className="news-btn"
                onClick={() => navigate("/news")}
            >
                الأخبار المحفوظة
            </button>

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
                    <select
                        value={creationType}
                        onChange={(e) => setCreationType(e.target.value)}
                        required
                        className="select-input"
                    >
                        <option value="template_only">استخدام القالب فقط</option>
                        <option value="openai_only">OpenAI استخدام فقط</option>
                        <option value="hybrid">OpenAIدمج القالب و</option>
                    </select>
                </div>
                <div className="form-group">
    <input
        type="text"
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
        placeholder="أدخل رقم القالب"
        className="select-input"
        required
    />
    <button
        type="button"
        onClick={handleTemplateLoad}
        className="load-template-btn"
    >
        تحميل القالب
    </button>
</div>
                {templateLoading && <p>جارٍ تحميل القالب...</p>}
                {templateFields && templateFields.length > 0 && (
                    templateFields.map((field) => (
                        <div className="form-group" key={field}>
                            <label>{field}</label>
                            <input
                                type="text"
                                value={dynamicFields[field] || ''}
                                onChange={(e) => setDynamicFields({ ...dynamicFields, [field]: e.target.value })}
                                placeholder={`أدخل ${field}`}
                                required
                            />
                        </div>
                    ))
                )}
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
                <Route path="/" element={<MainForm/>}/>
                <Route path="/news" element={<NewsList/>}/>
                <Route path="/news/:id" element={<NewsArticle/>}/>
                <Route path="/manage-templates" element={<ManageTemplates/>}/>
            </Routes>
        </Router>
    );
}

export default App;