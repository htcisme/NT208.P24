"use client"; // Client Component indicator

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import Link from "next/link";
import "@/styles-comp/style.css";
import "@/app/admin/ActivitiesDashboard/style.css";
import Header from "@/components/Header";

const ActivitiesDashboard = () => {
  const [activeTab, setActiveTab] = useState('activities');
  const [activeView, setActiveView] = useState('allPages'); // 'allPages', 'addPage', or 'editPage'
  const [editingTask, setEditingTask] = useState(null);
  
  // Sample data for the tasks/posts
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ', content: 'Nội dung bài viết...', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 16/04/2025', action: 'Chỉnh sửa/Xóa/Sao chép', selected: false },
    { id: 2, title: 'Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ', content: 'Nội dung bài viết...', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 16/04/2025', action: 'Chỉnh sửa/Xóa/Sao chép', selected: false },
    { id: 3, title: 'Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ', content: 'Nội dung bài viết...', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 16/04/2025', action: 'Chỉnh sửa/Xóa/Sao chép', selected: false },
    { id: 4, title: 'Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ', content: 'Nội dung bài viết...', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 16/04/2025', action: 'Chỉnh sửa/Xóa/Sao chép', selected: false },
    { id: 5, title: 'Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ', content: 'Nội dung bài viết...', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 16/04/2025', action: 'Chỉnh sửa/Xóa/Sao chép', selected: false },
  ]);

  // Sample data for comments
  const [comments, setComments] = useState([
    { id: 1, comment: 'Ngọn Đuốc Xanh năm nay tuyệt quá!', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 14/04/2025', reply: 'Ngọn Đuốc Xanh năm nay tuyệt quá!', selected: false, isReplying: false, isEditing: false },
    { id: 2, comment: 'Ngọn Đuốc Xanh năm nay tuyệt quá!', author: 'Nguyễn Đình Khang', time: '15:00 - Thứ Hai, Ngày 14/04/2025', reply: 'Ngọn Đuốc Xanh năm nay tuyệt quá!', selected: false, isReplying: false, isEditing: false },
  ]);

  // For new page creation
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Page status and settings
  const [pageStatus, setPageStatus] = useState('published'); // 'published' or 'draft'
  const [publishOption, setPublishOption] = useState('immediate'); // 'immediate' or 'scheduled'
  const [commentOption, setCommentOption] = useState('open'); // 'open' or 'closed'
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // For editing comments
  const [editCommentText, setEditCommentText] = useState('');
  const [replyCommentText, setReplyCommentText] = useState('');

  // Post information right panel state
  const [infoTab, setInfoTab] = useState('basic');

  // Selected batch action
  const [batchAction, setBatchAction] = useState('delete'); // 'delete', 'copy', 'edit'
  const [commentBatchAction, setCommentBatchAction] = useState('delete'); // 'delete', 'edit', 'reply'

  // Handle checkbox selection for tasks
  const handleTaskSelection = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, selected: !task.selected } : task
    ));
  };

  // Handle checkbox selection for comments
  const handleCommentSelection = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, selected: !comment.selected } : comment
    ));
  };

  // Handle select all tasks
  const handleSelectAllTasks = (e) => {
    setTasks(tasks.map(task => ({ ...task, selected: e.target.checked })));
  };

  // Handle select all comments
  const handleSelectAllComments = (e) => {
    setComments(comments.map(comment => ({ ...comment, selected: e.target.checked })));
  };

  // Execute batch action on tasks
  const executeBatchActionOnTasks = () => {
    if (batchAction === 'delete') {
      setTasks(tasks.filter(task => !task.selected));
    } else if (batchAction === 'copy') {
      const selectedTasks = tasks.filter(task => task.selected);
      const newTasks = selectedTasks.map(task => ({
        ...task, 
        id: Date.now() + Math.random(), 
        selected: false
      }));
      setTasks([...tasks, ...newTasks]);
    } else if (batchAction === 'edit') {
      // For editing multiple tasks, we can implement a bulk edit interface
      // For simplicity, we'll just edit the first selected task
      const selectedTask = tasks.find(task => task.selected);
      if (selectedTask) {
        editTask(selectedTask.id);
      }
    }
  };

  // Execute batch action on comments
  const executeBatchActionOnComments = () => {
    if (commentBatchAction === 'delete') {
      setComments(comments.filter(comment => !comment.selected));
    } else if (commentBatchAction === 'edit') {
      // For simplicity, edit the first selected comment
      const selectedComment = comments.find(comment => comment.selected);
      if (selectedComment) {
        toggleEdit(selectedComment.id);
      }
    } else if (commentBatchAction === 'reply') {
      // For simplicity, reply to the first selected comment
      const selectedComment = comments.find(comment => comment.selected);
      if (selectedComment) {
        toggleReply(selectedComment.id);
      }
    }
  };

  // Delete a single task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Delete a single comment
  const deleteComment = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  // Copy a task
  const copyTask = (task) => {
    const newTask = { ...task, id: Date.now(), selected: false };
    setTasks([...tasks, newTask]);
  };

  // Edit a task
  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setEditingTask(taskToEdit);
    setNewTitle(taskToEdit.title);
    setNewContent(taskToEdit.content);
    setActiveView('editPage');
  };

  // Update edited task
  const updateTask = () => {
    if (newTitle.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id
        ? { ...task, title: newTitle, content: newContent }
        : task
    ));
    
    setNewTitle('');
    setNewContent('');
    setEditingTask(null);
    setActiveView('allPages');
  };

  // Toggle reply for a comment
  const toggleReply = (id) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, isReplying: !comment.isReplying, isEditing: false } 
        : { ...comment, isReplying: false }
    ));
    setReplyCommentText('');
  };

  // Toggle edit for a comment
  const toggleEdit = (id) => {
    const commentToEdit = comments.find(comment => comment.id === id);
    setEditCommentText(commentToEdit.comment);
    
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, isEditing: !comment.isEditing, isReplying: false } 
        : { ...comment, isEditing: false }
    ));
  };

  // Submit comment reply
  const submitReply = (id) => {
    if (replyCommentText.trim() === '') return;
    
    const newComment = {
      id: Date.now(),
      comment: replyCommentText,
      author: 'Nguyễn Đình Khang',
      time: '15:00 - Thứ Hai, Ngày 14/04/2025',
      reply: comments.find(comment => comment.id === id).comment,
      selected: false,
      isReplying: false,
      isEditing: false
    };
    
    setComments([...comments, newComment]);
    toggleReply(id);
  };

  // Submit comment edit
  const submitEdit = (id) => {
    if (editCommentText.trim() === '') return;
    
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, comment: editCommentText, isEditing: false } 
        : comment
    ));
  };

  // Add new page
  const addNewPage = () => {
    if (newTitle.trim() === '') return;
    
    const newPage = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      author: 'Nguyễn Đình Khang',
      time: '15:00 - Thứ Hai, Ngày 14/04/2025',
      action: 'Chỉnh sửa/Xóa/Sao chép',
      selected: false,
      status: pageStatus,
      publishOption: publishOption,
      commentOption: commentOption
    };
    
    setTasks([...tasks, newPage]);
    setNewTitle('');
    setNewContent('');
    setActiveView('allPages');
  };

  // Render the page editor (used for both add and edit)
  const renderPageEditor = (isEditing = false) => (
    <div className="add-page-container">
      <div className="add-page-content">
        <h2>{isEditing ? 'CHỈNH SỬA TIÊU ĐỀ' : 'THÊM TIÊU ĐỀ'}</h2>
        <input 
          type="text" 
          placeholder="Thêm nội dung mới"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="add-title-input"
        />
        <textarea 
          placeholder="Thêm nội dung mới"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="add-content-textarea"
        />
      </div>
      <div className="add-page-sidebar">
        <h3>Thông tin bài viết</h3>
        <div className="info-tabs">
          <button 
            className={infoTab === 'basic' ? 'active' : ''}
            onClick={() => setInfoTab('basic')}
          >
            Thông tin
          </button>
          <button 
            className={infoTab === 'publish' ? 'active' : ''}
            onClick={() => setInfoTab('publish')}
          >
            Xuất bản
          </button>
        </div>
        <div className="info-content">
          {infoTab === 'basic' && (
            <>
              <div className="info-row">
                <label>Trạng thái:</label>
                <select 
                  value={pageStatus} 
                  onChange={(e) => setPageStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              <div className="info-row">
                <label>Bình luận:</label>
                <div className="button-toggle">
                  <button 
                    className={commentOption === 'open' ? 'active' : ''}
                    onClick={() => setCommentOption('open')}
                  >
                    Mở
                  </button>
                  <button 
                    className={commentOption === 'closed' ? 'active' : ''}
                    onClick={() => setCommentOption('closed')}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </>
          )}
          
          {infoTab === 'publish' && (
            <>
              <div className="info-row">
                <label>Xuất bản:</label>
                <div className="button-toggle">
                  <button 
                    className={publishOption === 'immediate' ? 'active' : ''}
                    onClick={() => setPublishOption('immediate')}
                  >
                    Ngay
                  </button>
                  <button 
                    className={publishOption === 'scheduled' ? 'active' : ''}
                    onClick={() => setPublishOption('scheduled')}
                  >
                    Lịch hẹn
                  </button>
                </div>
              </div>
              
              {publishOption === 'scheduled' && (
                <div className="scheduling-options">
                  <div className="info-row">
                    <label>Ngày:</label>
                    <input 
                      type="date" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <div className="info-row">
                    <label>Giờ:</label>
                    <input 
                      type="time" 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="time-input"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="publish-actions">
          <button 
            className="btn-draft"
            onClick={() => {
              setPageStatus('draft');
              if (isEditing) updateTask(); else addNewPage();
            }}
          >
            Lưu bản nháp
          </button>
          <button 
            className="btn-publish"
            onClick={isEditing ? updateTask : addNewPage}
          >
            {isEditing ? 'Cập nhật' : 'Xuất bản'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <HeaderAdmin></HeaderAdmin>

      <div className="admin-content">
        <div className="admin-action-bar">
          <div className="action-buttons-left">
            <button 
              className={`btn-nav ${activeView === 'allPages' ? 'active' : ''}`}
              onClick={() => setActiveView('allPages')}
            >
              TẤT CẢ CÁC TRANG
            </button>
            <button 
              className={`btn-nav ${activeView === 'addPage' ? 'active' : ''}`}
              onClick={() => {
                setNewTitle('');
                setNewContent('');
                setActiveView('addPage');
              }}
            >
              THÊM TRANG MỚI
            </button>
          </div>
          
          {activeView === 'allPages' && (
            <div className="batch-action-container">
              <select 
                className="batch-action-select"
                value={batchAction}
                onChange={(e) => setBatchAction(e.target.value)}
              >
                <option value="delete">Xóa</option>
                <option value="copy">Sao chép</option>
                <option value="edit">Chỉnh sửa</option>
              </select>
              <button 
                className="btn-batch-action"
                onClick={executeBatchActionOnTasks}
              >
                THỰC HIỆN
              </button>
            </div>
          )}
        </div>

        {activeView === 'allPages' && (
          <div className="content-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAllTasks}
                      checked={tasks.length > 0 && tasks.every(task => task.selected)}
                    />
                  </th>
                  <th>TIÊU ĐỀ</th>
                  <th>TÁC GIẢ</th>
                  <th>THỜI GIAN</th>
                  <th>TÁC VỤ</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={task.selected} 
                        onChange={() => handleTaskSelection(task.id)}
                      />
                    </td>
                    <td>{task.title}</td>
                    <td>{task.author}</td>
                    <td>{task.time}</td>
                    <td>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => editTask(task.id)}
                      >
                        Chỉnh sửa
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => deleteTask(task.id)}
                      >
                        Xóa
                      </button>
                      <button 
                        className="action-btn copy-btn"
                        onClick={() => copyTask(task)}
                      >
                        Sao chép
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === 'addPage' && renderPageEditor(false)}
        {activeView === 'editPage' && renderPageEditor(true)}

        <div className="comment-section">
          <div className="section-header">
            <h3>BÌNH LUẬN</h3>
            <div className="batch-action-container">
              <select 
                className="batch-action-select"
                value={commentBatchAction}
                onChange={(e) => setCommentBatchAction(e.target.value)}
              >
                <option value="delete">Xóa</option>
                <option value="edit">Chỉnh sửa</option>
                <option value="reply">Trả lời</option>
              </select>
              <button 
                className="btn-batch-action"
                onClick={executeBatchActionOnComments}
              >
                THỰC HIỆN
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAllComments} 
                    checked={comments.length > 0 && comments.every(comment => comment.selected)}
                  />
                </th>
                <th>BÌNH LUẬN</th>
                <th>TÁC GIẢ</th>
                <th>THỜI GIAN</th>
                <th>TRẢ LỜI CHO</th>
                <th>TÁC VỤ</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <React.Fragment key={comment.id}>
                  <tr className="comment-row">
                    <td>
                      <input 
                        type="checkbox" 
                        checked={comment.selected} 
                        onChange={() => handleCommentSelection(comment.id)}
                      />
                    </td>
                    <td className="comment-text">{comment.comment}</td>
                    <td>{comment.author}</td>
                    <td>{comment.time}</td>
                    <td>{comment.reply}</td>
                    <td>
                      <button 
                        className="action-btn reply-btn"
                        onClick={() => toggleReply(comment.id)}
                      >
                        Trả lời
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => toggleEdit(comment.id)}
                      >
                        Chỉnh sửa
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                  
                  {comment.isReplying && (
                    <tr className="reply-row">
                      <td colSpan="6">
                        <div className="reply-container">
                          <h4>Trả lời bình luận</h4>
                          <textarea 
                            value={replyCommentText}
                            onChange={(e) => setReplyCommentText(e.target.value)}
                            className="reply-textarea"
                            placeholder="Nhập trả lời của bạn"
                          />
                          <div className="reply-actions">
                            <button 
                              className="btn-publish"
                              onClick={() => submitReply(comment.id)}
                            >
                              Bình luận
                            </button>
                            <button 
                              className="btn-cancel"
                              onClick={() => toggleReply(comment.id)}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {comment.isEditing && (
                    <tr className="edit-row">
                      <td colSpan="6">
                        <div className="edit-container">
                          <h4>Chỉnh sửa bình luận</h4>
                          <textarea 
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="edit-textarea"
                          />
                          <div className="edit-actions">
                            <button 
                              className="btn-publish"
                              onClick={() => submitEdit(comment.id)}
                            >
                              Cập nhật
                            </button>
                            <button 
                              className="btn-cancel"
                              onClick={() => toggleEdit(comment.id)}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesDashboard;