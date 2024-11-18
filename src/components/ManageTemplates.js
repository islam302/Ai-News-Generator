import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageTemplates.css";

const API_URL = "http://127.0.0.1:8000/llm/manage-templates/";

function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ news_type: "", templates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newsTypes = ["زيارة", "عقد مؤتمر", "عقد ورشة عمل", "إفتتاح وتدشين"];
  const variables = [
    "{place}",
    "{participants}",
    "{event}",
    "{event_details}",
    "{date}",
    "{source}",
    "{news_type}"
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error.response || error.message);
      setError("Unable to fetch templates.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        setTemplates(templates.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Error deleting template:", error.response || error.message);
        alert("Failed to delete template.");
      }
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
        setNewTemplate({ news_type: "", templates: [] });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating template:", error.response || error.message);
        alert("Failed to create template.");
      }
    }
  };

  const openModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setNewTemplate({ news_type: "", templates: [] });
    setIsModalOpen(false);
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
            <th>#</th>
            <th>News Type</th>
            <th>Templates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template, index) => (
            <tr key={template.id}>
              <td>{index + 1}</td>
              <td>{template.news_type}</td>
              <td>
                <ul>
                  {template.templates.map((temp, i) => (
                    <li key={i}>{temp}</li>
                  ))}
                </ul>
              </td>
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

            {/* Dropdown for selecting news type */}
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

            {/* Display variable instructions */}
            <p className="variables-info">

              استخدم هذه المتغيرات في انشاء التنسيق :

              {variables.map((variable, index) => (
                <span key={index} className="variable">{variable}</span>
              ))}
            </p>

            {/* Textarea for entering templates */}
            <label htmlFor="templates">Template:</label>
            <textarea
              id="templates"
              rows="5"
              placeholder={`Example:\nاليوم في {place}، قام {participants} بزيارة {event}.`}
              value={selectedTemplate ? selectedTemplate.templates.join(", ") : newTemplate.templates.join(", ")}
              onChange={(e) =>
                selectedTemplate
                  ? setSelectedTemplate({ ...selectedTemplate, templates: e.target.value.split(",") })
                  : setNewTemplate({ ...newTemplate, templates: e.target.value.split(",") })
              }
            ></textarea>

            {/* Action buttons */}
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
