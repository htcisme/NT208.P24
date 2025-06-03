"use client";

import React, { useState } from "react";

const CommentForm = ({ onSubmit, replyTo = null, onCancel = null, currentUser }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    
    const result = await onSubmit({
      content: content.trim(),
      replyTo
    });

    if (result.success) {
      setContent("");
      if (onCancel) onCancel(); // Close reply form
    } else {
      alert(result.message || "Có lỗi xảy ra khi gửi bình luận");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form className={`comment-form ${replyTo ? 'reply-form' : ''}`} onSubmit={handleSubmit}>
      {replyTo && (
        <div className="reply-indicator">
          <span>Trả lời bình luận</span>
        </div>
      )}
      
      <div className="user-info">
        <div className="user-avatar">
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="user-details">
          <span className="user-name">{currentUser?.name || currentUser?.username || "Người dùng"}</span>
          <span className="user-email">{currentUser?.email}</span>
        </div>
      </div>

      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? "Nhập câu trả lời..." : "Viết bình luận của bạn..."}
          rows={replyTo ? 3 : 4}
          maxLength={1000}
          disabled={isSubmitting}
          required
        />
        <div className="char-count">
          {content.length}/1000
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
          className="btn-submit"
        >
          {isSubmitting ? "Đang gửi..." : (replyTo ? "Trả lời" : "Gửi bình luận")}
        </button>
        
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-cancel"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;