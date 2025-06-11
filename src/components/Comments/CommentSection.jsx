"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import "./CommentSection.css";

const CommentSection = ({ activitySlug, commentOption = "open" }) => {
  const { user } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/activities/${activitySlug}/comments`);
      const data = await response.json();

      if (data.success) {
        const commentsData = Array.isArray(data.data) ? data.data : [];
        // Log first comment's avatar data
        if (commentsData.length > 0) {
          console.log(
            "Sample comment avatar:",
            commentsData[0].authorAvatar?.substring(0, 50) + "..."
          );
        }
        setComments(commentsData);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Có lỗi xảy ra khi tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activitySlug) {
      fetchComments();
    }
  }, [activitySlug]);

  // Handle new comment
  const handleNewComment = async (commentData) => {
    try {
      console.log("User data:", {
        name: user?.name,
        avatar: user?.avatar?.substring(0, 50) + "...", // Log first 50 chars of avatar
      });

      const response = await fetch(`/api/activities/${activitySlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentData.content,
          author: user?.name || user?.username || "Ẩn danh",
          authorEmail: user?.email,
          authorAvatar: user?.avatar || null,
          replyTo: commentData.replyTo || null,
        }),
      });
      const data = await response.json();
      console.log("Comment response:", {
        success: data.success,
        hasAvatar: !!data.data?.authorAvatar,
      });

      if (data.success) {
        await fetchComments(); // Refresh comments
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      return { success: false, message: "Có lỗi xảy ra khi gửi bình luận" };
    }
  };

  // Handle login redirect - REDIRECT ĐÊN TRANG ĐĂNG KÝ/ĐĂNG NHẬP
  const handleLoginRedirect = () => {
    router.push("/User?tab=login"); // Redirect đến trang đăng ký/đăng nhập
  };

  if (commentOption === "closed") {
    return (
      <div className="comment-section">
        <div className="comments-closed">
          <p>Bình luận đã được đóng cho bài viết này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>Bình luận ({comments.length})</h3>
      </div>

      {/* Comment Form - HIỂN THỊ LOGIN PROMPT */}
      {user ? (
        <CommentForm onSubmit={handleNewComment} currentUser={user} />
      ) : (
        <div className="login-prompt">
          <p>
            Vui lòng{" "}
            <button onClick={handleLoginRedirect} className="login-link-button">
              đăng nhập
            </button>{" "}
            để bình luận.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="loading">Đang tải bình luận...</div>
      ) : error ? (
        <div className="error">Lỗi: {error}</div>
      ) : (
        <CommentList
          comments={comments.map((comment) => ({
            ...comment,
            authorAvatar: comment.authorAvatar || null,
          }))}
          onReply={handleNewComment}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default CommentSection;
