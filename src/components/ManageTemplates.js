import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ManageTemplates.css";

const API_URL = "https://news-llm-generator.onrender.com/llm/manage-templates/";

function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ news_type: "", templates: "" });
  const [variables, setVariables] = useState([
    "{place}",
    "{participants}",
    "{event}",
    "{event_details}",
    "{date}",
    "{source}",
    "{news_type}",
  ]);
  const [newVariable, setNewVariable] = useState("");
  const textareaRef = useRef(null); // Reference for textarea
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newsTypes = ["زيارة", "عقد مؤتمر", "عقد ورشة عمل", "إفتتاح وتدشين"];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);

      // ترتيب القوالب بناءً على رقم الـ id
      const sortedTemplates = response.data.sort((a, b) => a.id - b.id);

      setTemplates(sortedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error.response || error.message);
      setError("Unable to fetch templates.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (selectedTemplate?.id) {
      // Update existing template
      try {
        const response = await axios.put(`${API_URL}${selectedTemplate.id}/`, selectedTemplate);
        setTemplates(
          templates.map((t) => (t.id === selectedTemplate.id ? response.data : t))
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating template:", error.response || error.message);
        alert("Failed to update template.");
      }
    } else {
      // Create new template
      try {
        const response = await axios.post(API_URL, newTemplate);
        setTemplates([...templates, response.data]);
        setNewTemplate({ news_type: "", templates: "" });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating template:", error.response || error.message);
        alert("Failed to create template.");
      }
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        setTemplates(templates.filter((template) => template.id !== id));
      } catch (error) {
        console.error("Error deleting template:", error.response || error.message);
        alert("Failed to delete the template.");
      }
    }
  };

  const openModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setNewTemplate({ news_type: "", templates: "" });
    setIsModalOpen(false);
  };

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = selectedTemplate
      ? selectedTemplate.templates
      : newTemplate.templates;

    const newValue =
      currentValue.slice(0, start) + variable + currentValue.slice(end);

    if (selectedTemplate) {
      setSelectedTemplate({ ...selectedTemplate, templates: newValue });
    } else {
      setNewTemplate({ ...newTemplate, templates: newValue });
    }

    // Move the cursor to the end of the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const addNewVariable = () => {
    const formattedVariable = `{${newVariable.trim()}}`; // إضافة الأقواس حول المتغير
    if (newVariable.trim() && !variables.includes(formattedVariable)) {
      setVariables([...variables, formattedVariable]);
      setNewVariable(""); // إعادة تعيين حقل الإدخال
    }
  };

  if (loading) return <p className="loading">Loading templates...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="homepage">
      <h1>News Templates</h1>
      <button onClick={() => openModal(null)} className="add-btn">Add New Template</button>
      <table className="templates-table">
        <thead>
        <tr>
          <th>id</th>
          <th>News Type</th>
          <th>Templates</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.id}</td>
              {/* تم تغيير الرقم إلى id الفعلي للقالب */}
              <td>{template.news_type}</td>
              <td>{template.templates}</td>
              <td>
                <button onClick={() => openModal(template)} className="edit-btn">Edit</button>
                <button onClick={() => handleDeleteTemplate(template.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>

      {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedTemplate ? "Edit Template" : "Add New Template"}</h2>

              <label htmlFor="news-type">News Type:</label>
              <select
                  id="news-type"
                  value={selectedTemplate ? selectedTemplate.news_type : newTemplate.news_type}
                  onChange={(e) =>
                      selectedTemplate
                          ? setSelectedTemplate({ ...selectedTemplate, news_type: e.target.value })
                  : setNewTemplate({ ...newTemplate, news_type: e.target.value })
              }
              required
            >
              <option value="">اختر نوع الخبر</option>
              {newsTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <p className="variables-info">
              اضغط على المتغير لإضافته في القالب:
            </p>
            <div className="variable-list">
              {variables.map((variable, index) => (
                <span
                  key={index}
                  className="variable"
                  onClick={() => insertVariable(variable)}
                >
                  {variable}
                </span>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              rows="5"
              value={selectedTemplate ? selectedTemplate.templates : newTemplate.templates}
              onChange={(e) =>
                selectedTemplate
                  ? setSelectedTemplate({ ...selectedTemplate, templates: e.target.value })
                  : setNewTemplate({ ...newTemplate, templates: e.target.value })
              }
              placeholder="اكتب القالب هنا..."
            ></textarea>

            <label htmlFor="new-variable">أضف متغيرًا جديدًا:</label>
            <div className="new-variable-container">
              <input
                type="text"
                id="new-variable"
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                placeholder="أضف متغيرًا جديدًا"
              />
              <button onClick={addNewVariable}>Add</button>
            </div>

            <div className="modal-actions">
              <button onClick={handleSaveTemplate}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTemplates;
