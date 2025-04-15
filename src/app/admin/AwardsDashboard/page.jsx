"use client"; // Client Component indicator

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import "@/styles-comp/style.css";
import "@/app/AwardsAdminDashboard/style.css";

function AwardsAdminDashboard() {
  const [currentUser, setCurrentUser] = useState('Nguyễn Đình Khang');
  const [activeTab, setActiveTab] = useState('THÀNH TÍCH');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit'
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Bằng khen \"Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014\"",
      organization: "Đại học Quốc gia Hồ Chí Minh",
      date: "16/02/2015",
      content: "Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014",
      year: "2012-2014"
    },
    {
      id: 2,
      title: "Bằng khen \"Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014\"",
      organization: "Đại học Quốc gia Hồ Chí Minh",
      date: "16/02/2015",
      content: "Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014",
      year: "2012-2014"
    },
    {
      id: 3,
      title: "Bằng khen \"Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014\"",
      organization: "Đại học Quốc gia Hồ Chí Minh",
      date: "16/02/2015",
      content: "Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014",
      year: "2012-2014"
    },
    {
      id: 4,
      title: "Bằng khen \"Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014\"",
      organization: "Đại học Quốc gia Hồ Chí Minh",
      date: "16/02/2015",
      content: "Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014",
      year: "2012-2014"
    }
  ]);

  const handleAddAchievement = (formData) => {
    const newAchievement = {
      id: achievements.length + 1,
      title: `Bằng khen "${formData.content}"`,
      organization: formData.organization,
      content: formData.content,
      year: formData.year,
      date: getCurrentDate()
    };
    
    setAchievements([...achievements, newAchievement]);
    setViewMode('list');
  };

  const handleEditAchievement = (formData) => {
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
  };

  const handleDeleteAchievement = (id) => {
    const updatedAchievements = achievements.filter(achievement => achievement.id !== id);
    setAchievements(updatedAchievements);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-title">TRANG QUẢN TRỊ</h1>
        <div className="user-profile">
          <span className="user-name">{currentUser}</span>
          <div className="user-avatar">
            <i className="user-icon"></i>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        {['TRANG CHỦ', 'GIỚI THIỆU', 'HOẠT ĐỘNG', 'THÀNH TÍCH', 'ĐẶT PHÒNG', 'LIÊN HỆ'].map(tab => (
          <button 
            key={tab} 
            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

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

        {/* Achievement List */}
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
        <button type="submit" className="btn btn-primary">Thêm</button>
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

export default AwardsAdminDashboard;