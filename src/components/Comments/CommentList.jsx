"use client";

import React, { useState } from "react";
import CommentForm from "./CommentForm";

const CommentItem = ({ comment, onReply, currentUser, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const getAvatarDisplay = (avatarData) => {
    if (!avatarData) {
      return {
        type: "default",
        src: "/Img/default-avatar.png",
      };
    }

    if (avatarData.startsWith("data:image")) {
      return {
        type: "base64",
        src: avatarData,
      };
    }

    return {
      type: "url",
      src: avatarData.startsWith("http")
        ? avatarData
        : "/Img/default-avatar.png",
    };
  };

  const avatarDisplay = getAvatarDisplay(comment.authorAvatar);
  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReply = async (replyData) => {
    const result = await onReply({
      ...replyData,
      replyTo: comment._id,
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
              {comment.authorAvatar ? (
                <Image
                  src={avatarDisplay.src}
                  alt={`${comment.author}'s avatar`}
                  width={40}
                  height={40}
                  className={`avatar-image ${avatarDisplay.type}`}
                  onError={(e) => {
                    console.error("Avatar load error:", e);
                    e.target.src = "/Img/default-avatar.png";
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  {comment.author
                    ? comment.author.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
            </div>
            <div className="comment-author-details">
              <span className="comment-author">
                {comment.author || "Ẩn danh"}
              </span>
              <span className="comment-date">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
          {/* Thêm badge cho admin hoặc author nếu cần */}
          {comment.isAdmin && <span className="author-badge admin">Admin</span>}
          {comment.isAuthor && <span className="author-badge">Tác giả</span>}
        </div>

        <div className="comment-text">
          {/* Hiển thị reply-to nếu là comment trả lời */}
          {comment.replyToAuthor && (
            <div className="reply-to">Trả lời @{comment.replyToAuthor}</div>
          )}
          {comment.content}
        </div>

        <div className="comment-actions">
          {currentUser && level < maxLevel && (
            <>
              <button
                className="btn-reply"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                {showReplyForm ? "Hủy" : "Trả lời"}
              </button>
              {/* Thêm nút xóa nếu user là người viết comment */}
              {currentUser.id === comment.userId && (
                <button
                  className="btn-delete"
                  onClick={() => onDelete(comment._id)}
                >
                  Xóa
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showReplyForm && (
        <CommentForm
          onSubmit={handleReply}
          replyTo={comment._id}
          replyToAuthor={comment.author}
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
    commentsArray.forEach((comment) => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });

    // Tổ chức theo cấu trúc cây
    commentsArray.forEach((comment) => {
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
          {comment.replies.map((reply) => renderComment(reply, level + 1))}
        </div>
      )}
    </div>
  );

  const organizedComments = organizeComments(comments);

  return (
    <div className="comment-list">
      {organizedComments.map((comment) => renderComment(comment))}
    </div>
  );
};

export default CommentList;
