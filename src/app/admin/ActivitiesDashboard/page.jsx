"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import Image from "next/image";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import Link from "next/link";
import "@/app/admin/ActivitiesDashboard/style.css";
import { set } from "mongoose";
import { ImageProcessor } from "@/lib/imageUtils";

function ActivitiesDashboard() {
  const [imageDataArray, setImageDataArray] = useState([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const { user, username } = useSession();
  const [activityType, setActivityType] = useState("other");
  const [activeTab, setActiveTab] = useState("activities");
  const [activeView, setActiveView] = useState("allPages");
  const [editingTask, setEditingTask] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingId, setSubmittingId] = useState(null); // For tracking specific item operations

  // Khởi tạo state với mảng rỗng thay vì dữ liệu mẫu
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [realComments, setRealComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  // State cho việc tải ảnh lên
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlsArray, setImageUrlsArray] = useState([]);
  const [urlBlocks, setUrlBlocks] = useState([]);

  // State cho cata
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    value: "",
    label: "",
    icon: "",
    description: "",
  });

  // For new page creation
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Page status and settings
  const [pageStatus, setPageStatus] = useState("published");
  const [publishOption, setPublishOption] = useState("immediate");
  const [commentOption, setCommentOption] = useState("open");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // For editing comments
  const [editCommentText, setEditCommentText] = useState("");
  const [replyCommentText, setReplyCommentText] = useState("");

  // Post information right panel state
  const [infoTab, setInfoTab] = useState("basic");

  // Thêm state cho reply
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // Selected batch action
  const [batchAction, setBatchAction] = useState("delete");
  const [commentBatchAction, setCommentBatchAction] = useState("delete");
  const [batchEditOptions, setBatchEditOptions] = useState({
    status: "",
    type: "",
  });
  const [showBatchEditModal, setShowBatchEditModal] = useState(false);

  useEffect(() => {
    // Tạo style element cho dynamic colors
    const style = document.createElement("style");
    const colors = categories
      .map(
        (cat) =>
          `[data-type="${cat.value}"] { --type-color: ${getColorForType(
            cat.value
          )}; }`
      )
      .join("\n");

    style.innerHTML = colors;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, [categories]);

  // Hàm xử lý upload ảnh
  const handleImageUpload = async (files) => {
    const processedImages = [];

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`File ${file.name} không phải là ảnh`);
          continue;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert(`File ${file.name} quá lớn (>2MB)`);
          continue;
        }

        const base64Image = await ImageProcessor.fileToBase64(file);
        processedImages.push(base64Image);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        alert(`Lỗi xử lý ${file.name}: ${error.message}`);
      }
    }

    setImageDataArray((prev) => [...prev, ...processedImages]);
  };

  // Hàm xóa ảnh khỏi danh sách
  const removeBase64Image = (index) => {
    setImageDataArray((prev) => prev.filter((_, i) => i !== index));
  };

  // Component hiển thị base64 image
  const Base64ImagePreview = ({ imageData, index, onRemove }) => {
    const src = `data:${imageData.contentType};base64,${imageData.data}`;
    const sizeInMB = (imageData.size / 1024 / 1024).toFixed(2);

    return (
      <div className="base64-image-item">
        <div className="image-preview">
          <img
            src={src}
            alt={imageData.filename}
            onError={(e) => {
              e.target.style.display = "none";
              console.error("Error loading base64 image");
            }}
          />
          <button
            className="remove-image-btn"
            onClick={() => onRemove(index)}
            title="Xóa ảnh"
          >
            ×
          </button>
        </div>
        <div className="image-info">
          <span className="filename">{imageData.filename}</span>
          <span className="filesize">{sizeInMB}MB</span>
        </div>
      </div>
    );
  };

  // Hàm helper để tạo màu ngẫu nhiên hoặc từ một bảng màu có sẵn
  const getColorForType = (type) => {
    const colors = {
      academic: "#007bff",
      competition: "#ff9800",
      seminar: "#fd7e14",
      research: "#6f42c1",
      // Thêm các màu khác tùy ý
    };
    return colors[type] || "#6c757d"; // Màu mặc định nếu không tìm thấy
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setAvailableTypes(data.data);
          // Nếu chưa có type được chọn, set mặc định là type đầu tiên
          if (!activityType && data.data.length > 0) {
            setActivityType(data.data[0].value);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách chuyên mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách chuyên mục:", error);
        setError("Không thể tải danh sách chuyên mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Kiểm tra nếu component đã mount trước khi render
  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  // Hàm kiểm tra ảnh có tồn tại hay không
  const validateImageExists = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      setTimeout(() => resolve(false), 10000); // 10s timeout
    });
  };

  const handleAddCategory = async () => {
    if (!validateCategory()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (data.success) {
        setCategories([...categories, data.data]); // Sử dụng dữ liệu từ server
        setNewCategory({ value: "", label: "", description: "" });
        alert("Thêm chuyên mục thành công!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm chuyên mục:", error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!validateCategory()) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory.value}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (data.success) {
        setCategories(
          categories.map((cat) =>
            cat.value === editingCategory.value ? data.data : cat
          )
        );
        setEditingCategory(null);
        setNewCategory({ value: "", label: "", description: "" });
        alert("Cập nhật chuyên mục thành công!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật chuyên mục:", error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ ...category });
  };

  const handleDeleteCategory = async (value) => {
    if (isSubmitting || !window.confirm("Bạn có chắc muốn xóa chuyên mục này?"))
      return;

    try {
      setIsSubmitting(true);
      setSubmittingId(value);

      const response = await fetch(`/api/categories/${value}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCategories((prev) => prev.filter((cat) => cat.value !== value));
      alert("Xóa chuyên mục thành công!");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
      setSubmittingId(null);
    }
  };

  const validateCategory = () => {
    if (!newCategory.value?.trim()) {
      alert("Vui lòng nhập mã chuyên mục");
      return false;
    }
    if (!newCategory.label?.trim()) {
      alert("Vui lòng nhập tên hiển thị");
      return false;
    }
    return true;
  };

  // Hàm xử lý thay đổi URL ảnh
  const handleImageUrlsChange = (e) => {
    const newValue = e.target.value;
    const urls = newValue.split("\n");

    // Giữ lại các URL cũ đã được validate
    const currentValidUrls = [...imageUrlsArray];

    // Kiểm tra từng URL mới
    urls.forEach((url, index) => {
      const trimmedUrl = url.trim();
      if (trimmedUrl !== "") {
        try {
          const urlObj = new URL(trimmedUrl);
          if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
            // Chỉ thêm URL mới nếu nó chưa tồn tại trong mảng
            if (!currentValidUrls.includes(trimmedUrl)) {
              currentValidUrls.push(trimmedUrl);
            }
          }
        } catch (e) {
          console.error("Invalid URL:", trimmedUrl);
        }
      }
    });

    setImageUrlsArray(currentValidUrls);

    // Cập nhật nội dung textarea với các URL hợp lệ
    e.target.value = currentValidUrls.join("\n");
  };

  // Thêm xử lý paste events
  const handleImageUrlsPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const urls = pastedText.split("\n");

    // Validate và tạo khối cho từng URL riêng biệt
    urls.forEach((url) => {
      const trimmedUrl = url.trim();
      if (trimmedUrl) {
        try {
          const urlObj = new URL(trimmedUrl);
          if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
            // Tạo một khối mới cho mỗi URL hợp lệ
            setUrlBlocks((prev) => [...prev, [trimmedUrl]]);
            setImageUrlsArray((prev) => [...prev, trimmedUrl]);
          }
        } catch (e) {
          console.error("Invalid URL:", trimmedUrl);
        }
      }
    });
  };

  // Kiểm tra tính hợp lệ của URL ảnh
  const checkImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = url;
    });
  };

  // Thêm ảnh từ URL
  const addImage = async () => {
    if (!imagePreview) return;

    if (!isValidImageUrl(imagePreview)) {
      alert("URL ảnh không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }

    try {
      await checkImage(imagePreview);
      setImageUrls([...imageUrls, imagePreview]);
      setImagePreview("");
    } catch {
      alert("Không thể tải ảnh từ URL này. Vui lòng thử URL khác!");
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/activities?limit=100000");

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu hoạt động");
      }

      const data = await response.json();

      if (data.success) {
        const formattedTasks = data.data.map((activity) => ({
          id: activity._id,
          slug: activity.slug,
          title: activity.title,
          content: activity.content,
          author: activity.author,
          time: formatDate(activity.createdAt),
          image: activity.images?.[0] || null, // Ảnh đại diện là ảnh đầu tiên
          images: activity.images || [], // Lưu toàn bộ mảng images
          status: activity.status,
          commentOption: activity.commentOption,
          type: activity.type || "other",
          selected: false,
        }));

        setTasks(formattedTasks);
      } else {
        throw new Error(data.message || "Lỗi khi lấy dữ liệu hoạt động");
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real comments from API
  const fetchRealComments = async () => {
    try {
      setCommentLoading(true);
      setError(null);

      const response = await fetch("/api/admin/comments?limit=100&page=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${
            errorText || "Không thể kết nối đến server"
          }`
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Dữ liệu trả về không đúng định dạng JSON");
      }

      if (data.success && data.data) {
        const formattedComments = data.data
          .map((comment) => {
            if (!comment._id || !comment.content) {
              console.warn("Comment thiếu thông tin:", comment);
              return null;
            }

            return {
              id: comment._id,
              content: comment.content || "",
              author: comment.author || "Ẩn danh",
              authorEmail: comment.authorEmail || "",
              time: comment.createdAt ? formatDate(comment.createdAt) : "",
              activitySlug: comment.activitySlug || "",
              activityTitle: comment.activityTitle || "Không có tiêu đề",
              selected: false,
            };
          })
          .filter(Boolean);

        setRealComments(formattedComments);
        console.log(`Đã tải thành công ${formattedComments.length} bình luận`);
      } else {
        throw new Error(data.message || "Dữ liệu trả về không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching real comments:", error);
      setError(`Không thể lấy dữ liệu bình luận: ${error.message}`);
      setRealComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await Promise.all([fetchActivities(), fetchRealComments()]);
          break;
        } catch (error) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error);

          if (retryCount === maxRetries) {
            console.error("Max retries reached, giving up");
            setError(
              "Không thể tải dữ liệu sau nhiều lần thử. Vui lòng làm mới trang."
            );
          } else {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }
      }
    };

    fetchData();
  }, []);

  // Xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 2MB");
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

  // Handle checkbox selection for real comments
  const handleRealCommentSelection = (id) => {
    setRealComments(
      realComments.map((comment) =>
        comment.id === id
          ? { ...comment, selected: !comment.selected }
          : comment
      )
    );
  };

  // Handle select all tasks
  const handleSelectAllTasks = (e) => {
    setTasks(tasks.map((task) => ({ ...task, selected: e.target.checked })));
  };

  // Handle select all real comments
  const handleSelectAllRealComments = (e) => {
    setRealComments(
      realComments.map((comment) => ({
        ...comment,
        selected: e.target.checked,
      }))
    );
  };

  // Delete real comment
  const deleteRealComment = async (commentId) => {
    const comment = realComments.find((c) => c.id === commentId);
    if (!comment) return;

    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        const response = await fetch("/api/admin/comments", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId: comment.id,
            activitySlug: comment.activitySlug,
          }),
        });

        if (response.ok) {
          setRealComments(realComments.filter((c) => c.id !== commentId));
          alert("Xóa bình luận thành công!");
        } else {
          throw new Error("Lỗi khi xóa bình luận");
        }
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        alert("Có lỗi xảy ra khi xóa bình luận!");
      }
    }
  };

  // Update real comment
  const updateRealComment = async (commentId, newContent) => {
    const comment = realComments.find((c) => c.id === commentId);
    if (!comment) return;

    try {
      const response = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: commentId,
          activitySlug: comment.activitySlug,
          content: newContent,
        }),
      });

      if (response.ok) {
        setRealComments(
          realComments.map((c) =>
            c.id === commentId
              ? { ...c, content: newContent, isEditing: false }
              : c
          )
        );
        alert("Cập nhật bình luận thành công!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi cập nhật bình luận");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
      alert("Có lỗi xảy ra khi cập nhật bình luận: " + error.message);
    }
  };

  // Thay thế hàm replyToComment hiện tại
  const replyToComment = async (commentId, replyContent) => {
    const comment = realComments.find((c) => c.id === commentId);

    if (!comment) {
      alert("Không tìm thấy bình luận!");
      return;
    }

    if (!replyContent.trim()) {
      alert("Vui lòng nhập nội dung reply!");
      return;
    }

    // Validate dữ liệu trước khi gửi
    if (!comment.activitySlug) {
      alert("Lỗi: Không tìm thấy thông tin bài viết!");
      return;
    }

    try {
      const requestData = {
        commentId: commentId,
        activitySlug: comment.activitySlug,
        content: replyContent.trim(),
        author: user?.name || user?.username || "Admin",
        authorEmail: user?.email || null,
      };

      console.log("=== Sending reply request ===");
      console.log("Request data:", requestData);
      console.log("===============================");

      const response = await fetch("/api/admin/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);

        // Thử parse JSON nếu có thể
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${errorText}`
          );
        } catch (parseError) {
          throw new Error(
            `HTTP ${response.status}: ${errorText || "Lỗi server"}`
          );
        }
      }

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Dữ liệu trả về không đúng định dạng JSON");
      }

      if (data.success) {
        alert("Đã reply bình luận thành công!");
        setReplyingTo(null);
        setReplyContent("");

        // Refresh comments list
        await fetchRealComments();
      } else {
        throw new Error(data.message || "Lỗi không xác định từ server");
      }
    } catch (error) {
      console.error("=== Error in replyToComment ===");
      console.error("Error:", error);
      console.error("===============================");

      let errorMessage = "Có lỗi xảy ra khi reply bình luận";

      if (error.message.includes("HTTP 404")) {
        errorMessage = "Không tìm thấy bài viết hoặc bình luận";
      } else if (error.message.includes("HTTP 400")) {
        errorMessage = "Dữ liệu gửi không hợp lệ";
      } else if (error.message.includes("HTTP 500")) {
        errorMessage = "Lỗi server, vui lòng thử lại sau";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  // Execute batch action on tasks
  const executeBatchActionOnTasks = async () => {
    const selectedTasks = tasks.filter((task) => task.selected);

    if (selectedTasks.length === 0) {
      alert("Vui lòng chọn ít nhất một bài viết!");
      return;
    }

    if (batchAction === "delete") {
      if (window.confirm("Bạn có chắc muốn xóa các bài viết đã chọn?")) {
        try {
          for (const task of selectedTasks) {
            await fetch(`/api/activities/${task.slug}`, {
              method: "DELETE",
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
          const formData = new FormData();
          formData.append("title", `${task.title} (Sao chép)`);
          formData.append("content", task.content);
          formData.append(
            "author",
            user?.name || user?.username || task.author
          );
          formData.append("status", task.status);
          formData.append("commentOption", task.commentOption);
          formData.append("type", task.type || "other");
          if (task.image) {
            formData.append("imageUrl", task.image);
          }

          const response = await fetch("/api/activities", {
            method: "POST",
            body: formData,
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
              type: data.data.type,
              selected: false,
            });
          }
        } catch (error) {
          console.error("Lỗi khi sao chép bài viết:", error);
        }
      }
      setTasks(newTasks);
    } else if (batchAction === "edit") {
      // Hiển thị modal để chọn giá trị muốn sửa
      setShowBatchEditModal(true);
      return; // Không thực hiện ngay, chờ user chọn
    }

    // Reset selection sau khi hoàn thành
    setTasks((prev) => prev.map((task) => ({ ...task, selected: false })));
  };

  // Execute batch action on real comments
  const executeBatchActionOnRealComments = () => {
    const selectedComments = realComments.filter((comment) => comment.selected);

    if (selectedComments.length === 0) {
      alert("Vui lòng chọn ít nhất một bình luận!");
      return;
    }

    if (commentBatchAction === "delete") {
      if (
        window.confirm(
          `Bạn có chắc muốn xóa ${selectedComments.length} bình luận đã chọn?`
        )
      ) {
        selectedComments.forEach((comment) => deleteRealComment(comment.id));
      }
    }
  };

  // Hàm thực hiện batch edit sau khi user chọn options
  const executeBatchEdit = async () => {
    const selectedTasks = tasks.filter((task) => task.selected);

    try {
      if (batchEditOptions.type) {
        const response = await fetch("/api/categories");
        const { data: categories } = await response.json();
        const isValidType = categories.some(
          (cat) => cat.value === batchEditOptions.type
        );

        if (!isValidType) {
          throw new Error("Type không hợp lệ");
        }
      }
      for (const task of selectedTasks) {
        const formData = new FormData();

        // Giữ nguyên các thông tin cũ
        formData.append("title", task.title);
        formData.append("content", task.content);
        formData.append("author", task.author);
        formData.append("commentOption", task.commentOption);

        // Chỉ cập nhật status và type nếu user đã chọn
        formData.append("status", batchEditOptions.status || task.status);
        formData.append("type", batchEditOptions.type || task.type);

        if (task.image) {
          formData.append("imageUrl", task.image);
        }

        await fetch(`/api/activities/${task.slug}`, {
          method: "PUT",
          body: formData,
        });
      }

      // Cập nhật state với giá trị mới
      setTasks((prev) =>
        prev.map((task) =>
          task.selected
            ? {
                ...task,
                status: batchEditOptions.status || task.status,
                type: batchEditOptions.type || task.type,
                selected: false,
              }
            : { ...task, selected: false }
        )
      );

      alert("Đã chỉnh sửa tất cả bài viết đã chọn!");
      setShowBatchEditModal(false);
      setBatchEditOptions({ status: "", type: "" });
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa hàng loạt:", error);
      alert("Có lỗi khi chỉnh sửa bài viết!");
    }
  };

  // Delete a single task
  const deleteTask = async (slug) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        const response = await fetch(`/api/activities/${slug}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTasks(tasks.filter((task) => task.slug !== slug));
        } else {
          throw new Error("Lỗi khi xóa bài viết");
        }
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        alert("Có lỗi xảy ra khi xóa bài viết!");
      }
    }
  };

  // Copy a task
  const copyTask = async (task) => {
    try {
      const formData = new FormData();
      formData.append("title", `${task.title} (Sao chép)`);
      formData.append("content", task.content);
      formData.append("author", user?.name || user?.username || task.author);
      formData.append("status", task.status);
      formData.append("commentOption", task.commentOption);
      formData.append("type", task.type || "other");
      if (task.image) {
        formData.append("imageUrl", task.image);
      }
      const response = await fetch("/api/activities", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setTasks([
          ...tasks,
          {
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
          },
        ]);

        alert(`Đã sao chép thành công: "${data.data.title}"`);
      } else {
        alert(`Lỗi khi sao chép: ${data.message || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Lỗi khi sao chép bài viết:", error);
      alert("Có lỗi xảy ra khi sao chép bài viết!");
    }
  };

  // Edit a task
  const editTask = async (slug) => {
    const task = tasks.find((t) => t.slug === slug);
    if (task) {
      setEditingTask(task);
      setNewTitle(task.title);
      setNewContent(task.content);
      setPageStatus(task.status);
      setCommentOption(task.commentOption);
      setActivityType(task.type || "other");

      // Load existing images - phân loại URLs và base64
      if (task.images && task.images.length > 0) {
        const urlImages = [];
        const base64Images = [];

        task.images.forEach((img) => {
          if (typeof img === "string") {
            urlImages.push(img);
          } else if (img && img.data && img.contentType) {
            base64Images.push(img);
          }
        });

        setImageUrlsArray(urlImages);
        setImageDataArray(base64Images);
      } else {
        setImageUrlsArray([]);
        setImageDataArray([]);
      }

      setActiveView("editPage");
    }
  };

  // Update edited task
  const updateTask = async () => {
    if (!editingTask) return;

    if (!activityType) {
      alert("Vui lòng chọn loại hoạt động!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("content", newContent);
      formData.append("status", pageStatus);
      formData.append("commentOption", commentOption);
      formData.append("type", activityType);

      // Gửi cả URL images và base64 images
      const allImages = [
        ...imageUrlsArray, // URLs
        ...imageDataArray, // Base64 objects
      ];

      formData.append("images", JSON.stringify(allImages));

      const response = await fetch(`/api/activities/${editingTask.slug}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (data.success && response.ok) {
        // Cập nhật danh sách tasks
        setTasks(
          tasks.map((task) =>
            task.slug === editingTask.slug
              ? {
                  ...task,
                  title: newTitle,
                  content: newContent,
                  status: pageStatus,
                  commentOption: commentOption,
                  type: activityType,
                  images: data.data.images,
                  image: data.data.images?.[0] || null,
                }
              : task
          )
        );

        // Reset tất cả các trường
        setActiveView("allPages");
        setEditingTask(null);
        setNewTitle("");
        setNewContent("");
        setPageStatus("published");
        setCommentOption("open");
        setImagePreview("");
        setImageUrlsArray([]);
        setImageDataArray([]); // Reset base64 images
        setUrlBlocks([]);
        setActivityType("other");
        setUploadedImage(null);

        alert("Cập nhật bài viết thành công!");
      } else {
        throw new Error(data.message || "Lỗi khi cập nhật bài viết");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      alert("Có lỗi xảy ra khi cập nhật bài viết: " + error.message);
    }
  };

  const validateImage = async (imageUrl) => {
    // Kiểm tra định dạng URL
    if (!isValidImageUrl(imageUrl)) {
      throw new Error("URL ảnh không đúng định dạng");
    }

    // Kiểm tra ảnh có tồn tại
    try {
      await checkImage(imageUrl);
      return true;
    } catch {
      throw new Error("Không thể tải ảnh từ URL này");
    }
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
    try {
      setIsSubmitting(true);

      // Format images data trước khi gửi
      const formattedImages = imageDataArray.map((img) => ({
        data: img.data,
        contentType: img.contentType,
        filename: img.filename || "image",
        size: img.size || 0,
      }));

      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("content", newContent);
      formData.append("author", user?.name || user?.username || "Admin");
      formData.append("status", pageStatus);
      formData.append("commentOption", commentOption);
      formData.append("type", activityType);

      // Gửi images dưới dạng JSON string
      formData.append("images", JSON.stringify(formattedImages));

      const response = await fetch("/api/activities", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setNewTitle("");
        setNewContent("");
        setImageDataArray([]);
        setActivityType("other");
        setActiveView("allPages");
        alert("Tạo hoạt động mới thành công!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thêm hàm cập nhật slug
  const updateSlugs = async () => {
    try {
      const response = await fetch("/api/activities/update-slugs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        // Refresh danh sách hoạt động
        fetchActivities();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật slug:", error);
      alert("Có lỗi xảy ra khi cập nhật slug");
    }
  };

  // Render the page editor (used for both add and edit)
  const renderPageEditor = (isEditing = false) => (
    <div className="add-page-container">
      {isSubmitting && (
        <div className="form-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        </div>
      )}
      <div className="add-page-content">
        <h2>{isEditing ? "CHỈNH SỬA BÀI VIẾT" : "THÊM BÀI VIẾT MỚI"}</h2>
        <input
          type="text"
          placeholder="Nhập tiêu đề bài viết"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="add-title-input"
        />

        {/* Phần upload ảnh được cập nhật */}
        <div className="image-upload-container">
          <h3>Hình ảnh</h3>

          {/* Upload từ máy tính */}
          <div className="upload-section">
            <h4>Upload từ máy tính</h4>
            <div className="upload-controls">
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleImageUpload(Array.from(e.target.files));
                  }
                }}
                style={{ display: "none" }}
              />
              <label htmlFor="imageUpload" className="upload-btn">
                {isProcessingImages ? "Đang xử lý..." : "Chọn ảnh từ máy tính"}
              </label>
              <small className="help-text">
                Chọn nhiều ảnh cùng lúc. Tối đa 2MB/ảnh. Định dạng: JPG, PNG,
                GIF
              </small>
            </div>

            {/* Hiển thị ảnh base64 đã upload */}
            {imageDataArray.length > 0 && (
              <div className="base64-images-preview">
                <h5>Ảnh đã upload ({imageDataArray.length}):</h5>
                <div className="images-grid">
                  {imageDataArray.map((imageData, index) => (
                    <Base64ImagePreview
                      key={index}
                      imageData={imageData}
                      index={index}
                      onRemove={removeBase64Image}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tổng kết */}
          <div className="images-summary">
            <div className="summary-item">
              <strong>
                Tổng số ảnh: {imageDataArray.length + imageUrlsArray.length}
              </strong>
            </div>
            <div className="summary-breakdown">
              <span>• Ảnh upload: {imageDataArray.length}</span>
            </div>
          </div>
        </div>

        <textarea
          placeholder="Nhập nội dung bài viết"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="add-content-textarea"
        />
      </div>

      {/* Sidebar không đổi */}
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
                <label>Loại hoạt động:</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="type-select"
                  required
                >
                  <option value="">-- Chọn loại hoạt động --</option>
                  {categories.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
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
            disabled={isSubmitting}
            onClick={() => {
              setPageStatus("draft");
              if (isEditing) updateTask();
              else addNewPage();
            }}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu bản nháp"}
          </button>
          <button
            className="btn-publish"
            disabled={isSubmitting}
            onClick={isEditing ? updateTask : addNewPage}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditing
              ? "Cập nhật"
              : "Xuất bản"}
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
              TẤT CẢ TIN BÀI
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
              THÊM BÀI VIẾT
            </button>
            <button
              className={`btn-nav ${
                activeView === "categories" ? "active" : ""
              }`}
              onClick={() => setActiveView("categories")}
            >
              QUẢN LÝ CHUYÊN MỤC
            </button>
          </div>

          {activeView === "allPages" && (
            <button className="update-slugs-btn" onClick={updateSlugs}>
              CẬP NHẬT TẤT CẢ SLUG
            </button>
          )}

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
          <>
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
                            tasks.length > 0 &&
                            tasks.every((task) => task.selected)
                          }
                        />
                      </th>
                      <th className="image-col">HÌNH ẢNH</th>
                      <th>TIÊU ĐỀ</th>
                      <th>LOẠI</th>
                      <th>TÁC GIẢ</th>
                      <th>THỜI GIAN</th>
                      <th>TÁC VỤ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      return (
                        <tr key={task.slug}>
                          <td>
                            <input
                              type="checkbox"
                              checked={task.selected}
                              onChange={() => handleTaskSelection(task.slug)}
                            />
                          </td>
                          <td className="task-image-cell">
                            {task.images && task.images.length > 0 ? (
                              <div className="task-thumbnail">
                                <img
                                  src={
                                    typeof task.images[0] === "string"
                                      ? task.images[0] // URL
                                      : `data:${task.images[0].contentType};base64,${task.images[0].data}` // Base64
                                  }
                                  alt={task.title}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                  }}
                                  onLoad={(e) => {
                                    e.target.classList.add("loaded");
                                  }}
                                  className="loading"
                                />
                                {task.images.length > 1 && (
                                  <div className="image-count">
                                    +{task.images.length - 1}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="no-image">Không có ảnh</div>
                            )}
                          </td>
                          <td>{task.title}</td>
                          <td className="type-cell">
                            <span className="type-badge" data-type={task.type}>
                              {categories.find((cat) => cat.value === task.type)
                                ?.label || "Khác"}
                            </span>
                          </td>
                          <td>{task.author}</td>
                          <td>{task.time}</td>
                          <td>
                            <div class="button-column">
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-message">
                  Chưa có bài viết nào. Hãy thêm bài viết mới!
                </div>
              )}
            </div>

            <div className="comment-section">
              <div className="section-header">
                <h3>BÌNH LUẬN ({realComments.length})</h3>
                <div className="batch-action-container">
                  <select
                    className="batch-action-select"
                    value={commentBatchAction}
                    onChange={(e) => setCommentBatchAction(e.target.value)}
                  >
                    <option value="delete">Xóa</option>
                    <option value="edit">Chỉnh sửa</option>
                  </select>
                  <button
                    className="btn-batch-action"
                    onClick={executeBatchActionOnRealComments}
                  >
                    THỰC HIỆN
                  </button>
                  <button
                    className="btn-refresh"
                    onClick={fetchRealComments}
                    disabled={commentLoading}
                  >
                    {commentLoading ? "Đang tải..." : "Làm mới"}
                  </button>
                </div>
              </div>

              {commentLoading ? (
                <div className="loading">Đang tải bình luận...</div>
              ) : realComments.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="checkbox-col">
                        <input
                          type="checkbox"
                          onChange={handleSelectAllRealComments}
                          checked={
                            realComments.length > 0 &&
                            realComments.every((comment) => comment.selected)
                          }
                        />
                      </th>
                      <th>BÌNH LUẬN</th>
                      <th>TÁC GIẢ</th>
                      <th>BÀI VIẾT</th>
                      <th>THỜI GIAN</th>
                      <th>TÁC VỤ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realComments.map((comment) => (
                      <React.Fragment key={comment.id}>
                        <tr className="comment-row">
                          <td>
                            <input
                              type="checkbox"
                              checked={comment.selected}
                              onChange={() =>
                                handleRealCommentSelection(comment.id)
                              }
                            />
                          </td>
                          <td className="comment-text">
                            <div
                              style={{
                                maxWidth: "300px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {comment.content}
                            </div>
                          </td>
                          <td>{comment.author}</td>
                          <td>
                            <a
                              href={`/Activities/${comment.activitySlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#042354",
                                textDecoration: "none",
                              }}
                            >
                              {comment.activityTitle}
                            </a>
                          </td>
                          <td>{comment.time}</td>
                          <td className="table-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => {
                                setRealComments(
                                  realComments.map((c) =>
                                    c.id === comment.id
                                      ? { ...c, isEditing: !c.isEditing }
                                      : { ...c, isEditing: false }
                                  )
                                );
                                if (!comment.isEditing) {
                                  setEditCommentText(comment.content);
                                }
                              }}
                            >
                              {comment.isEditing ? "Hủy" : "Chỉnh sửa"}
                            </button>

                            <button
                              className="action-btn reply-btn"
                              onClick={() => {
                                setReplyingTo(
                                  replyingTo === comment.id ? null : comment.id
                                );
                                setReplyContent("");
                              }}
                            >
                              {replyingTo === comment.id
                                ? "Hủy Reply"
                                : "Reply"}
                            </button>

                            <button
                              className="action-btn delete-btn"
                              onClick={() => deleteRealComment(comment.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>

                        {comment.isEditing && (
                          <tr className="edit-row">
                            <td colSpan="6">
                              <div className="edit-container">
                                <h4>Chỉnh sửa bình luận</h4>
                                <textarea
                                  value={editCommentText}
                                  onChange={(e) =>
                                    setEditCommentText(e.target.value)
                                  }
                                  className="edit-textarea"
                                  rows="3"
                                />
                                <div className="edit-actions">
                                  <button
                                    className="btn-publish"
                                    onClick={() => {
                                      if (editCommentText.trim()) {
                                        updateRealComment(
                                          comment.id,
                                          editCommentText.trim()
                                        );
                                      }
                                    }}
                                  >
                                    Cập nhật
                                  </button>
                                  <button
                                    className="btn-cancel"
                                    onClick={() => {
                                      setRealComments(
                                        realComments.map((c) =>
                                          c.id === comment.id
                                            ? { ...c, isEditing: false }
                                            : c
                                        )
                                      );
                                    }}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        {replyingTo === comment.id && (
                          <tr className="reply-row">
                            <td colSpan="6">
                              <div className="reply-container">
                                <h4>
                                  Reply cho bình luận của {comment.author}
                                </h4>
                                <textarea
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
                                  className="reply-textarea"
                                  rows="3"
                                  placeholder="Nhập nội dung reply..."
                                  maxLength="1000"
                                />
                                <div className="reply-actions">
                                  <button
                                    className="btn-publish"
                                    onClick={() => {
                                      const content = replyContent.trim();
                                      if (content) {
                                        replyToComment(comment.id, content);
                                      } else {
                                        alert("Vui lòng nhập nội dung reply!");
                                      }
                                    }}
                                    disabled={!replyContent.trim()}
                                  >
                                    Gửi Reply
                                  </button>
                                  <button
                                    className="btn-cancel"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyContent("");
                                    }}
                                  >
                                    Hủy
                                  </button>
                                </div>
                                <div className="reply-hint">
                                  <small>
                                    Tối đa 1000 ký tự. Hiện tại:{" "}
                                    {replyContent.length}/1000
                                  </small>
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
                <div className="no-data-message">Chưa có bình luận nào.</div>
              )}
            </div>
          </>
        )}

        {activeView === "categories" && (
          <div className="content-section">
            {isSubmitting && !submittingId && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Đang xử lý...</p>
              </div>
            )}
            <div className="category-container">
              <div className="category-form">
                <h3>
                  {editingCategory
                    ? "Chỉnh sửa chuyên mục"
                    : "Thêm chuyên mục mới"}
                </h3>
                <div className="form-group">
                  <label>Mã chuyên mục:</label>
                  <input
                    type="text"
                    value={newCategory.value}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, value: e.target.value })
                    }
                    placeholder="vd: academic"
                    className="form-control"
                    disabled={editingCategory} // Disable khi đang edit
                  />
                </div>
                <div className="form-group">
                  <label>Tên hiển thị:</label>
                  <input
                    type="text"
                    value={newCategory.label}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, label: e.target.value })
                    }
                    placeholder="vd: Học tập"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Mô tả về chuyên mục"
                    className="form-control"
                    rows="3"
                  />
                </div>
                {editingCategory ? (
                  <div className="edit-actions">
                    <button
                      className="btn-update-category"
                      onClick={async () => {
                        if (validateCategory()) {
                          try {
                            const response = await fetch(
                              `/api/categories/${editingCategory.value}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(newCategory),
                              }
                            );

                            if (response.ok) {
                              setCategories(
                                categories.map((cat) =>
                                  cat.value === editingCategory.value
                                    ? newCategory
                                    : cat
                                )
                              );
                              setEditingCategory(null);
                              setNewCategory({
                                value: "",
                                label: "",
                                description: "",
                              });
                              alert("Cập nhật chuyên mục thành công!");
                            }
                          } catch (error) {
                            console.error("Lỗi khi cập nhật:", error);
                            alert("Có lỗi xảy ra khi cập nhật chuyên mục");
                          }
                        }
                      }}
                    >
                      Cập nhật
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategory({
                          value: "",
                          label: "",
                          description: "",
                        });
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-add-category"
                    onClick={handleAddCategory}
                  >
                    Thêm chuyên mục
                  </button>
                )}
              </div>

              <div className="category-list">
                <h3>Danh sách chuyên mục</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Tên hiển thị</th>
                      <th>Mô tả</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.value}>
                        <td>{category.value}</td>
                        <td>{category.label}</td>
                        <td>{category.description}</td>
                        <td>
                          <div className="button-column">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditCategory(category)}
                            >
                              Sửa
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() =>
                                handleDeleteCategory(category.value)
                              }
                            >
                              {isLoading ? "Đang xóa..." : "Xóa"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === "addPage" && renderPageEditor(false)}
        {activeView === "editPage" && renderPageEditor(true)}

        {showBatchEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Chỉnh sửa hàng loạt</h3>

              <div className="form-group">
                <label>
                  Trạng thái mới (để trống nếu không muốn thay đổi):
                </label>
                <select
                  value={batchEditOptions.status}
                  onChange={(e) =>
                    setBatchEditOptions((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Giữ nguyên --</option>
                  <option value="draft">Nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loại mới (để trống nếu không muốn thay đổi):</label>
                <select
                  value={batchEditOptions.type}
                  onChange={(e) =>
                    setBatchEditOptions((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Giữ nguyên --</option>
                  {availableTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn-publish" onClick={executeBatchEdit}>
                  Cập nhật
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowBatchEditModal(false);
                    setBatchEditOptions({ status: "", type: "" });
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivitiesDashboard;
