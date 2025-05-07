"use client"; 

import React, { useState, useEffect } from "react";
import Link from "next/link";
import HeaderAdmin from "@/components/HeaderAdmin";
import "@/styles-comp/style.css";
import "@/app/admin/AwardsDashboard/style.css";

function AwardsDashboard() {
  const [currentUser, setCurrentUser] = useState('Nguyễn Đình Khang');
  const [activeTab, setActiveTab] = useState('THÀNH TÍCH');
  const [viewMode, setViewMode] = useState('list');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch awards from API
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/awards');
        
        if (!response.ok) {
          throw new Error('Không thể tải danh sách giải thưởng');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Chuyển đổi dữ liệu từ API sang format hiển thị
          const formattedAwards = data.data.map(award => ({
            id: award._id,
            title: `Bằng khen "${award.content}"`,
            organization: award.organization,
            date: formatDate(award.date),
            content: award.content,
            year: award.year
          }));
          
          setAchievements(formattedAwards);
        } else {
          throw new Error(data.message || 'Lỗi khi tải dữ liệu');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching awards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  const handleAddAchievement = async (formData) => {
    try {
      const response = await fetch('/api/awards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization: formData.organization,
          content: formData.content,
          year: formData.year,
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm giải thưởng');
      }

      const data = await response.json();
      
      if (data.success) {
        const newAchievement = {
          id: data.data._id,
          title: `Bằng khen "${formData.content}"`,
          organization: formData.organization,
          content: formData.content,
          year: formData.year,
          date: formatDate(data.data.date)
        };
        
        setAchievements([...achievements, newAchievement]);
        setViewMode('list');
      } else {
        throw new Error(data.message || 'Lỗi khi thêm giải thưởng');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.error('Error adding award:', err);
    }
  };

  const handleEditAchievement = async (formData) => {
    try {
      const response = await fetch(`/api/awards/${selectedAchievement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization: formData.organization,
          content: formData.content,
          year: formData.year
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật giải thưởng');
      }

      const data = await response.json();
      
      if (data.success) {
        const updatedAchievements = achievements.map(achievement => {
          if (achievement.id === selectedAchievement.id) {
            return {
              ...achievement,
              title: `Bằng khen "${formData.content}"`,
              organization: formData.organization,
              content: formData.content,
              year: formData.year
            };
          }
          return achievement;
        });
        
        setAchievements(updatedAchievements);
        setViewMode('list');
        setSelectedAchievement(null);
      } else {
        throw new Error(data.message || 'Lỗi khi cập nhật giải thưởng');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.error('Error updating award:', err);
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giải thưởng này?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/awards/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Không thể xóa giải thưởng');
      }

      const data = await response.json();
      
      if (data.success) {
        const updatedAchievements = achievements.filter(achievement => achievement.id !== id);
        setAchievements(updatedAchievements);
      } else {
        throw new Error(data.message || 'Lỗi khi xóa giải thưởng');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.error('Error deleting award:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="admin-container">
      {/* Navigation Bar */}
      <HeaderAdmin></HeaderAdmin>

      {/* Content Area */}
      <main className="admin-content">
        {/* Tabs */}
        <div className="content-tabs">
          <button 
            className={`tab-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            TẤT CẢ THÀNH TÍCH
          </button>
          <button 
            className={`tab-button ${viewMode === 'add' || viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('add');
              setSelectedAchievement(null);
            }}
          >
            THÊM THÀNH TÍCH
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <div className="achievement-list">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-content">
                      <h3 className="achievement-title">{achievement.title}</h3>
                      <p className="achievement-org">{achievement.organization}</p>
                    </div>
                    <div className="achievement-actions">
                      <span className="achievement-date">Thời gian: {achievement.date}</span>
                      <button 
                        className="edit-button"
                        onClick={() => {
                          setSelectedAchievement(achievement);
                          setViewMode('edit');
                        }}
                      >
                        <i className="edit-icon"></i>
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteAchievement(achievement.id)}
                      >
                        <i className="delete-icon"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Achievement Form */}
            {viewMode === 'add' && (
              <AddAchievementForm onSubmit={handleAddAchievement} onCancel={() => setViewMode('list')} />
            )}

            {/* Edit Achievement Form */}
            {viewMode === 'edit' && selectedAchievement && (
              <EditAchievementForm 
                achievement={selectedAchievement} 
                onSubmit={handleEditAchievement} 
                onCancel={() => {
                  setViewMode('list');
                  setSelectedAchievement(null);
                }} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function AddAchievementForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    organization: '',
    content: '',
    year: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="achievement-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="organization" className="form-label">TÊN TỔ CHỨC CẤP</label>
        <input
          type="text"
          id="organization"
          name="organization"
          className="form-input"
          placeholder="Nhập tên tổ chức cấp giấy khen/bằng khen"
          value={formData.organization}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content" className="form-label">NỘI DUNG KHEN THƯỞNG</label>
        <input
          type="text"
          id="content"
          name="content"
          className="form-input"
          placeholder="Nhập nội dung khen thưởng"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="year" className="form-label">NĂM KHEN THƯỞNG</label>
        <input
          type="text"
          id="year"
          name="year"
          className="form-input"
          placeholder="Nhập năm khen thưởng"
          value={formData.year}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Thêm mới</button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}

function EditAchievementForm({ achievement, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    organization: achievement.organization,
    content: achievement.content,
    year: achievement.year
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="edit-container">
      <div className="achievement-item preview">
        <h3 className="achievement-title">{achievement.title}</h3>
        <p className="achievement-org">{achievement.organization}</p>
        <p className="achievement-date">Thời gian: {achievement.date}</p>
      </div>
      
      <form className="achievement-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="organization" className="form-label">TÊN TỔ CHỨC CẤP</label>
          <input
            type="text"
            id="organization"
            name="organization"
            className="form-input"
            placeholder="Cập nhật tên tổ chức cấp giấy khen/bằng khen"
            value={formData.organization}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">NỘI DUNG KHEN THƯỞNG</label>
          <input
            type="text"
            id="content"
            name="content"
            className="form-input"
            placeholder="Cập nhật nội dung khen thưởng"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year" className="form-label">NĂM KHEN THƯỞNG</label>
          <input
            type="text"
            id="year"
            name="year"
            className="form-input"
            placeholder="Cập nhật năm khen thưởng"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Cập nhật</button>
          <button type="button" className="btn btn-cancel" onClick={onCancel}>Hủy</button>
        </div>
      </form>
    </div>
  );
}

export default AwardsDashboard;