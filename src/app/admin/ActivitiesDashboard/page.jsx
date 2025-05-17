"use client"; // Client Component indicator

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import Link from "next/link";
import "@/styles-comp/style.css";
import "@/app/admin/ActivitiesDashboard/style.css";

const ActivitiesDashboard = () => {
  const [activeTab, setActiveTab] = useState("activities");
  const [activeView, setActiveView] = useState("allPages"); // 'allPages', 'addPage', or 'editPage'
  const [editingTask, setEditingTask] = useState(null);

  // Khởi tạo state với mảng rỗng thay vì dữ liệu mẫu
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho việc tải ảnh lên
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // For new page creation
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Page status and settings
  const [pageStatus, setPageStatus] = useState("published"); // 'published' or 'draft'
  const [publishOption, setPublishOption] = useState("immediate"); // 'immediate' or 'scheduled'
  const [commentOption, setCommentOption] = useState("open"); // 'open' or 'closed'
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // For editing comments
  const [editCommentText, setEditCommentText] = useState("");
  const [replyCommentText, setReplyCommentText] = useState("");

  // Post information right panel state
  const [infoTab, setInfoTab] = useState("basic");

  // Selected batch action
  const [batchAction, setBatchAction] = useState("delete"); // 'delete', 'copy', 'edit'
  const [commentBatchAction, setCommentBatchAction] = useState("delete"); // 'delete', 'edit', 'reply'

  // Fetch dữ liệu khi component được mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/activities');
        
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu hoạt động');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Chuyển đổi dữ liệu API thành định dạng hiện tại của ứng dụng
          const formattedTasks = data.data.map(activity => ({
            id: activity._id,
            slug: activity.slug,
            title: activity.title,
            content: activity.content,
            author: activity.author,
            time: formatDate(activity.createdAt),
            image: activity.image,
            status: activity.status,
            commentOption: activity.commentOption,
            selected: false,
          }));
          
          setTasks(formattedTasks);
        } else {
          throw new Error(data.message || 'Lỗi khi lấy dữ liệu hoạt động');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 2MB');
        return;
      }
      
      setUploadedImage(file);
      
      // Tạo URL preview cho ảnh
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle checkbox selection for tasks
  const handleTaskSelection = (slug) => {
    setTasks(
      tasks.map((task) =>
        task.slug === slug ? { ...task, selected: !task.selected } : task
      )
    );
  };

  // Handle checkbox selection for comments
  const handleCommentSelection = (slug) => {
    setComments(
      comments.map((comment) =>
        comment.slug === slug
          ? { ...comment, selected: !comment.selected }
          : comment
      )
    );
  };

  // Handle select all tasks
  const handleSelectAllTasks = (e) => {
    setTasks(tasks.map((task) => ({ ...task, selected: e.target.checked })));
  };

  // Handle select all comments
  const handleSelectAllComments = (e) => {
    setComments(
      comments.map((comment) => ({ ...comment, selected: e.target.checked }))
    );
  };

  // Execute batch action on tasks
  const executeBatchActionOnTasks = async () => {
    const selectedTasks = tasks.filter(task => task.selected);
    
    if (selectedTasks.length === 0) {
      alert("Vui lòng chọn ít nhất một bài viết!");
      return;
    }
    
    if (batchAction === "delete") {
      if (window.confirm("Bạn có chắc muốn xóa các bài viết đã chọn?")) {
        try {
          for (const task of selectedTasks) {
            await fetch(`/api/activities/${task.slug}`, {
              method: 'DELETE'
            });
          }
          
          setTasks(tasks.filter((task) => !task.selected));
        } catch (error) {
          console.error("Lỗi khi xóa bài viết:", error);
          alert("Có lỗi xảy ra khi xóa bài viết!");
        }
      }
    } else if (batchAction === "copy") {
      const selectedTasks = tasks.filter((task) => task.selected);
      const newTasks = [...tasks];
      
      for (const task of selectedTasks) {
        try {
          const response = await fetch('/api/activities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: `${task.title} (Sao chép)`,
              content: task.content,
              author: task.author,
              status: task.status,
              commentOption: task.commentOption,
              image: task.image
            }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            newTasks.push({
              id: data.data._id,
              slug: data.data.slug,
              title: data.data.title,
              content: data.data.content,
              author: data.data.author,
              image: data.data.image,
              time: formatDate(data.data.createdAt),
              status: data.data.status,
              commentOption: data.data.commentOption,
              selected: false,
            });
          }
        } catch (error) {
          console.error("Lỗi khi sao chép bài viết:", error);
        }
      }
      
      setTasks(newTasks);
    } else if (batchAction === "edit") {
      // For editing multiple tasks, we can implement a bulk edit interface
      // For simplicity, we'll just edit the first selected task
      const selectedTask = tasks.find((task) => task.selected);
      if (selectedTask) {
        editTask(selectedTask.slug);
      }
    }
  };

  // Execute batch action on comments
  const executeBatchActionOnComments = () => {
    if (commentBatchAction === "delete") {
      setComments(comments.filter((comment) => !comment.selected));
    } else if (commentBatchAction === "edit") {
      // For simplicity, edit the first selected comment
      const selectedComment = comments.find((comment) => comment.selected);
      if (selectedComment) {
        toggleEdit(selectedComment.slug);
      }
    } else if (commentBatchAction === "reply") {
      // For simplicity, reply to the first selected comment
      const selectedComment = comments.find((comment) => comment.selected);
      if (selectedComment) {
        toggleReply(selectedComment.slug);
      }
    }
  };

  // Delete a single task
  const deleteTask = async (slug) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        const response = await fetch(`/api/activities/${slug}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setTasks(tasks.filter((task) => task.slug !== slug));
        } else {
          throw new Error('Lỗi khi xóa bài viết');
        }
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        alert("Có lỗi xảy ra khi xóa bài viết!");
      }
    }
  };

  // Delete a single comment
  const deleteComment = (slug) => {
    setComments(comments.filter((comment) => comment.slug !== slug));
  };

  // Copy a task
  const copyTask = async (task) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${task.title} (Sao chép)`,
          content: task.content,
          author: task.author,
          status: task.status,
          commentOption: task.commentOption,
          image: task.image
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTasks([...tasks, {
          id: data.data._id,
          slug: data.data.slug,
          title: data.data.title,
          content: data.data.content,
          author: data.data.author,
          image: data.data.image,
          time: formatDate(data.data.createdAt),
          status: data.data.status,
          commentOption: data.data.commentOption,
          selected: false,
        }]);
      }
    } catch (error) {
      console.error("Lỗi khi sao chép bài viết:", error);
      alert("Có lỗi xảy ra khi sao chép bài viết!");
    }
  };

  // Edit a task
  const editTask = async (slug) => {
    const task = tasks.find(t => t.slug === slug);
    if (task) {
      setEditingTask(task);
      setNewTitle(task.title);
      setNewContent(task.content);
      setPageStatus(task.status);
      setCommentOption(task.commentOption);
      setImagePreview(task.image || "");
      setActiveView("editPage");
    }
  };

  // Update edited task
  const updateTask = async () => {
    if (!editingTask) return;

    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('status', pageStatus);
      formData.append('commentOption', commentOption);
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch(`/api/activities/${editingTask.slug}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTasks(tasks.map(task => 
            task.slug === editingTask.slug 
              ? {
                  ...task,
                  title: newTitle,
                  content: newContent,
                  status: pageStatus,
                  commentOption: commentOption,
                  image: data.data.image || task.image
                }
              : task
          ));
          setActiveView("allPages");
          setEditingTask(null);
          setNewTitle("");
          setNewContent("");
          setPageStatus("published");
          setCommentOption("open");
          setImagePreview("");
          setUploadedImage(null);
        }
      } else {
        throw new Error('Lỗi khi cập nhật bài viết');
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      alert("Có lỗi xảy ra khi cập nhật bài viết!");
    }
  };

  // Toggle reply for a comment
  const toggleReply = (slug) => {
    setComments(
      comments.map((comment) =>
        comment.slug === slug
          ? { ...comment, isReplying: !comment.isReplying, isEditing: false }
          : { ...comment, isReplying: false }
      )
    );
    setReplyCommentText("");
  };

  // Toggle edit for a comment
  const toggleEdit = (slug) => {
    const commentToEdit = comments.find((comment) => comment.slug === slug);
    setEditCommentText(commentToEdit.comment);

    setComments(
      comments.map((comment) =>
        comment.slug === slug
          ? { ...comment, isEditing: !comment.isEditing, isReplying: false }
          : { ...comment, isEditing: false }
      )
    );
  };

  // Submit comment reply
  const submitReply = (slug) => {
    if (replyCommentText.trim() === "") return;

    const newComment = {
      id: Date.now(),
      comment: replyCommentText,
      author: "Nguyễn Đình Khang",
      time: formatDate(new Date()),
      reply: comments.find((comment) => comment.slug === slug).comment,
      selected: false,
      isReplying: false,
      isEditing: false,
    };

    setComments([...comments, newComment]);
    toggleReply(slug);
  };

  // Submit comment edit
  const submitEdit = (slug) => {
    if (editCommentText.trim() === "") return;

    setComments(
      comments.map((comment) =>
        comment.slug === slug
          ? { ...comment, comment: editCommentText, isEditing: false }
          : comment
      )
    );
  };

  // Hàm format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} - Thứ Hai, Ngày ${day}/${month}/${year}`;
  };

  // Thêm hoạt động mới
  const addNewPage = async () => {
    if (newTitle.trim() === "") {
      alert("Tiêu đề không được để trống!");
      return;
    }

    try {
      // Tạo FormData để gửi cả dữ liệu và file
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('author', "Nguyễn Đình Khang"); // Hoặc lấy từ thông tin người dùng hiện tại
      formData.append('status', pageStatus);
      formData.append('commentOption', commentOption);
      
      if (publishOption === "scheduled") {
        formData.append('scheduledPublish', new Date(`${scheduledDate}T${scheduledTime}`).toISOString());
      }
      
      // Thêm ảnh nếu có
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('/api/activities', {
        method: 'POST',
        body: formData, // Không cần đặt Content-Type khi dùng FormData
      });

      const data = await response.json();
      
      if (data.success) {
        // Thêm vào danh sách hiển thị
        setTasks([...tasks, {
          id: data.data._id,
          slug: data.data.slug,
          title: data.data.title,
          content: data.data.content,
          author: data.data.author,
          image: data.data.image, // Thêm trường image
          time: formatDate(data.data.createdAt),
          status: data.data.status,
          commentOption: data.data.commentOption,
          selected: false,
        }]);
        
        setNewTitle("");
        setNewContent("");
        setUploadedImage(null);
        setImagePreview("");
        setActiveView("allPages");
        // Hiển thị thông báo thành công
      } else {
        // Hiển thị lỗi
        alert(data.message || "Có lỗi xảy ra khi tạo hoạt động mới");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Có lỗi xảy ra khi tạo hoạt động mới");
    }
  };

  // Thêm hàm cập nhật slug
  const updateSlugs = async () => {
    try {
      const response = await fetch('/api/activities/update-slugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        // Refresh danh sách hoạt động
        fetchActivities();
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật slug:', error);
      alert('Có lỗi xảy ra khi cập nhật slug');
    }
  };

  // Render the page editor (used for both add and edit)
  const renderPageEditor = (isEditing = false) => (
    <div className="add-page-container">
      <div className="add-page-content">
        <h2>{isEditing ? "CHỈNH SỬA BÀI VIẾT" : "THÊM BÀI VIẾT MỚI"}</h2>
        <input
          type="text"
          placeholder="Nhập tiêu đề bài viết"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="add-title-input"
        />
        
        {/* Phần upload ảnh */}
        <div className="image-upload-container">
          <h3>Hình ảnh đại diện</h3>
          <div className="image-upload-box">
            <input 
              type="file" 
              accept="image/*" 
              id="image-upload"
              onChange={handleImageChange}
              className="image-input" 
            />
            <label htmlFor="image-upload" className="image-upload-label">
              {imagePreview ? "Thay đổi ảnh" : "Chọn ảnh"}
            </label>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setUploadedImage(null);
                    setImagePreview("");
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <p className="image-hint">Kích thước đề xuất: 800x400px, tối đa 2MB</p>
        </div>
        
        <textarea
          placeholder="Nhập nội dung bài viết"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="add-content-textarea"
        />
      </div>
      
      <div className="add-page-sidebar">
        <h3>Thông tin bài viết</h3>
        <div className="info-tabs">
          <button
            className={infoTab === "basic" ? "active" : ""}
            onClick={() => setInfoTab("basic")}
          >
            Thông tin
          </button>
          <button
            className={infoTab === "publish" ? "active" : ""}
            onClick={() => setInfoTab("publish")}
          >
            Xuất bản
          </button>
        </div>
        <div className="info-content">
          {infoTab === "basic" && (
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
                    className={commentOption === "open" ? "active" : ""}
                    onClick={() => setCommentOption("open")}
                  >
                    Mở
                  </button>
                  <button
                    className={commentOption === "closed" ? "active" : ""}
                    onClick={() => setCommentOption("closed")}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </>
          )}

          {infoTab === "publish" && (
            <>
              <div className="info-row">
                <label>Xuất bản:</label>
                <div className="button-toggle">
                  <button
                    className={publishOption === "immediate" ? "active" : ""}
                    onClick={() => setPublishOption("immediate")}
                  >
                    Ngay
                  </button>
                  <button
                    className={publishOption === "scheduled" ? "active" : ""}
                    onClick={() => setPublishOption("scheduled")}
                  >
                    Lịch hẹn
                  </button>
                </div>
              </div>

              {publishOption === "scheduled" && (
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
              setPageStatus("draft");
              if (isEditing) updateTask();
              else addNewPage();
            }}
          >
            Lưu bản nháp
          </button>
          <button
            className="btn-publish"
            onClick={isEditing ? updateTask : addNewPage}
          >
            {isEditing ? "Cập nhật" : "Xuất bản"}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <HeaderAdmin />
        <div className="admin-content loading">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <HeaderAdmin />

      <div className="admin-content">
        <div className="admin-action-bar">
          <div className="action-buttons-left">
            <button
              className={`btn-nav ${activeView === "allPages" ? "active" : ""}`}
              onClick={() => setActiveView("allPages")}
            >
              TẤT CẢ CÁC TRANG
            </button>
            <button
              className={`btn-nav ${activeView === "addPage" ? "active" : ""}`}
              onClick={() => {
                setNewTitle("");
                setNewContent("");
                setUploadedImage(null);
                setImagePreview("");
                setActiveView("addPage");
              }}
            >
              THÊM TRANG MỚI
            </button>
            <button
              className="update-slugs-btn"
              onClick={updateSlugs}
            >
              CẬP NHẬT SLUG
            </button>
          </div>

          {activeView === "allPages" && (
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

        {activeView === "allPages" && (
          <div className="content-section">
            {tasks.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        onChange={handleSelectAllTasks}
                        checked={
                          tasks.length > 0 && tasks.every((task) => task.selected)
                        }
                      />
                    </th>
                    <th className="image-col">HÌNH ẢNH</th>
                    <th>TIÊU ĐỀ</th>
                    <th>TÁC GIẢ</th>
                    <th>THỜI GIAN</th>
                    <th>TÁC VỤ</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.slug}>
                      <td>
                        <input
                          type="checkbox"
                          checked={task.selected}
                          onChange={() => handleTaskSelection(task.slug)}
                        />
                      </td>
                      <td className="task-image-cell">
                        {task.image ? (
                          <div className="task-thumbnail">
                            <img src={task.image} alt={task.title} />
                          </div>
                        ) : (
                          <div className="no-image">Không có ảnh</div>
                        )}
                      </td>
                      <td>{task.title}</td>
                      <td>{task.author}</td>
                      <td>{task.time}</td>
                      <td>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => editTask(task.slug)}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteTask(task.slug)}
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
            ) : (
              <div className="no-data-message">
                Chưa có bài viết nào. Hãy thêm bài viết mới!
              </div>
            )}
          </div>
        )}

        {activeView === "addPage" && renderPageEditor(false)}
        {activeView === "editPage" && renderPageEditor(true)}

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

          {comments.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllComments}
                      checked={
                        comments.length > 0 &&
                        comments.every((comment) => comment.selected)
                      }
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
                {comments.map((comment) => (
                  <React.Fragment key={comment.slug}>
                    <tr className="comment-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={comment.selected}
                          onChange={() => handleCommentSelection(comment.slug)}
                        />
                      </td>
                      <td className="comment-text">{comment.comment}</td>
                      <td>{comment.author}</td>
                      <td>{comment.time}</td>
                      <td>{comment.reply}</td>
                      <td>
                        <button
                          className="action-btn reply-btn"
                          onClick={() => toggleReply(comment.slug)}
                        >
                          Trả lời
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => toggleEdit(comment.slug)}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteComment(comment.slug)}
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
                              onChange={(e) =>
                                setReplyCommentText(e.target.value)
                              }
                              className="reply-textarea"
                              placeholder="Nhập trả lời của bạn"
                            />
                            <div className="reply-actions">
                              <button
                                className="btn-publish"
                                onClick={() => submitReply(comment.slug)}
                              >
                                Bình luận
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => toggleReply(comment.slug)}
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
                                onClick={() => submitEdit(comment.slug)}
                              >
                                Cập nhật
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => toggleEdit(comment.slug)}
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
          ) : (
            <div className="no-data-message">
              Chưa có bình luận nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesDashboard;