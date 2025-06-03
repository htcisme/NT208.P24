"use client";

import React, { useState } from "react";
import CommentForm from "./CommentForm";

const CommentItem = ({ comment, onReply, currentUser, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleReply = async (replyData) => {
    const result = await onReply({
      ...replyData,
      replyTo: comment._id
    });
    
    if (result.success) {
      setShowReplyForm(false);
    }
    
    return result;
  };

  const maxLevel = 3; // Giới hạn độ sâu reply

  return (
    <div className={`comment-item level-${Math.min(level, maxLevel)}`}>
      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-author-info">
            <div className="comment-avatar">
              {comment.author ? comment.author.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="comment-author-details">
              <span className="comment-author">{comment.author || "Ẩn danh"}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="comment-text">
          {comment.content}
        </div>
        
        <div className="comment-actions">
          {currentUser && level < maxLevel && (
            <button 
              className="btn-reply"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              {showReplyForm ? "Hủy" : "Trả lời"}
            </button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <CommentForm 
          onSubmit={handleReply}
          replyTo={comment._id}
          onCancel={() => setShowReplyForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

const CommentList = ({ comments, onReply, currentUser }) => {
  // Kiểm tra comments có phải là array không
  if (!Array.isArray(comments) || comments.length === 0) {
    return (
      <div className="no-comments">
        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
      </div>
    );
  }

  // Tổ chức comments thành cây (tree structure)
  const organizeComments = (commentsArray) => {
    const commentMap = {};
    const topLevelComments = [];

    // Tạo map của tất cả comments
    commentsArray.forEach(comment => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });

    // Tổ chức theo cấu trúc cây
    commentsArray.forEach(comment => {
      if (comment.replyTo && commentMap[comment.replyTo]) {
        commentMap[comment.replyTo].replies.push(commentMap[comment._id]);
      } else {
        topLevelComments.push(commentMap[comment._id]);
      }
    });

    return topLevelComments;
  };

  const renderComment = (comment, level = 0) => (
    <div key={comment._id}>
      <CommentItem 
        comment={comment}
        onReply={onReply}
        currentUser={currentUser}
        level={level}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => renderComment(reply, level + 1))}
        </div>
      )}
    </div>
  );

  const organizedComments = organizeComments(comments);

  return (
    <div className="comment-list">
      {organizedComments.map(comment => renderComment(comment))}
    </div>
  );
};

export default CommentList;