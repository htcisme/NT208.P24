"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import withAdminAuth from "@/components/WithAdminAuth";
import HeaderAdmin from "@/components/HeaderAdmin";
import "./style.css";

function UsersDashboard() {
  // Thêm state để theo dõi người dùng được chọn
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Thêm state cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Các state hiện có
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminCode: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm lọc và tìm kiếm người dùng
  const getFilteredUsers = () => {
    let filteredUsers = [...users];

    // Áp dụng lọc theo vai trò
    if (filter !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === filter);
    }

    // Áp dụng tìm kiếm
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTermLower) ||
          user.email.toLowerCase().includes(searchTermLower) ||
          user.id.toLowerCase().includes(searchTermLower)
      );
    }

    return filteredUsers;
  };

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setLoadError("");
      setSelectedUsers([]); // Reset selected users when fetching new data

      const response = await fetch("/api/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Có lỗi xảy ra khi lấy danh sách người dùng"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "admin") {
      setShowAdminCode(true);
    } else if (name === "role" && value === "user") {
      setShowAdminCode(false);
      setFormData({
        ...formData,
        [name]: value,
        adminCode: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi thêm người dùng");
      }

      // Add the new user to the list
      setUsers([...users, data.user]);
      setFormSuccess(data.message || "Thêm người dùng thành công");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        adminCode: "",
      });
      setShowAdminCode(false);

      // Switch back to list view after a delay
      setTimeout(() => {
        setViewMode("list");
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      setFormError(error.message);
    }
  };

  // Handle edit user
  const handleEditUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Có lỗi xảy ra khi cập nhật người dùng"
        );
      }

      // Update the user in the list
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? data.user : user
      );

      setUsers(updatedUsers);
      setFormSuccess(data.message || "Cập nhật người dùng thành công");

      // Switch back to list view after a delay
      setTimeout(() => {
        setViewMode("list");
        setSelectedUser(null);
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Error updating user:", error);
      setFormError(error.message);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Có lỗi xảy ra khi xóa người dùng");
        }

        // Remove the user from the list
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);

        // Show a temporary success message
        setFormSuccess(data.message || "Xóa người dùng thành công");
        setTimeout(() => setFormSuccess(""), 2000);
      } catch (error) {
        console.error("Error deleting user:", error);
        setFormError(error.message);
        setTimeout(() => setFormError(""), 3000);
      }
    }
  };

  // Handle edit button
  const handleEditButton = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Leave password empty for update
      role: user.role,
      adminCode: "",
    });
    setShowAdminCode(user.role === "admin");
    setViewMode("edit");
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAllUsers = (e) => {
    if (e.target.checked) {
      const filteredUserIds = getFilteredUsers().map((user) => user.id);
      setSelectedUsers(filteredUserIds);
    } else {
      setSelectedUsers([]);
    }
  };
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      setFormError("Vui lòng chọn ít nhất một người dùng để xóa");
      setTimeout(() => setFormError(""), 3000);
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng đã chọn?`
      )
    ) {
      try {
        const response = await fetch("/api/users/bulk-delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds: selectedUsers }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Có lỗi xảy ra khi xóa người dùng");
        }

        // Cập nhật danh sách người dùng
        const updatedUsers = users.filter(
          (user) => !selectedUsers.includes(user.id)
        );
        setUsers(updatedUsers);

        // Reset selection
        setSelectedUsers([]);

        // Hiện thông báo thành công
        setFormSuccess(`Đã xóa ${selectedUsers.length} người dùng thành công`);
        setTimeout(() => setFormSuccess(""), 3000);
      } catch (error) {
        console.error("Error deleting users:", error);
        setFormError(error.message);
        setTimeout(() => setFormError(""), 3000);
      }
    }
  };
  const filteredUsers = getFilteredUsers();

  return (
    <div className="admin-container">
      <HeaderAdmin />

      <main className="admin-content">
        <div className="content-tabs">
          <button
            className={`tab-button ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            DANH SÁCH NGƯỜI DÙNG
          </button>
          <button
            className={`tab-button ${viewMode === "add" ? "active" : ""}`}
            onClick={() => {
              setViewMode("add");
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "user",
                adminCode: "",
              });
              setShowAdminCode(false);
              setFormError("");
              setFormSuccess("");
            }}
          >
            THÊM NGƯỜI DÙNG
          </button>
        </div>

        {formSuccess && (
          <div className="form-success global-message">{formSuccess}</div>
        )}
        {formError && (
          <div className="form-error global-message">{formError}</div>
        )}

        {viewMode === "list" && (
          <div className="users-list">
            {/* Thêm thanh tìm kiếm và lọc */}
            {!isLoading && (
              <div className="filter-search-container">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email hoặc ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      className="search-reset"
                      onClick={() => setSearchTerm("")}
                      title="Xóa tìm kiếm"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="filter-box">
                  <label htmlFor="role-filter">Lọc theo vai trò:</label>
                  <select
                    id="role-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="admin">Admin</option>
                    <option value="user">Đoàn viên</option>
                  </select>
                </div>
              </div>
            )}

            {/* Thêm action bar cho bulk operations */}
            {!isLoading && filteredUsers.length > 0 && (
              <div className="bulk-actions">
                <button
                  className="btn bulk-delete-btn"
                  onClick={handleBulkDelete}
                  disabled={selectedUsers.length === 0}
                >
                  Xóa đã chọn ({selectedUsers.length})
                </button>
                <div className="selection-info">
                  {selectedUsers.length > 0 ? (
                    <span>Đã chọn {selectedUsers.length} người dùng</span>
                  ) : (
                    <span>Chọn người dùng để thực hiện hành động</span>
                  )}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải danh sách người dùng...</p>
              </div>
            ) : loadError ? (
              <div className="error-message">{loadError}</div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                Chưa có người dùng nào trong hệ thống
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="no-results">
                Không tìm thấy người dùng phù hợp với tiêu chí tìm kiếm
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        onChange={handleSelectAllUsers}
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0 &&
                          filteredUsers.every((user) =>
                            selectedUsers.includes(user.id)
                          )
                        }
                        className="select-checkbox"
                        title="Chọn tất cả"
                      />
                    </th>
                    <th>ID</th>
                    <th>HỌ TÊN</th>
                    <th>EMAIL</th>
                    <th>VAI TRÒ</th>
                    <th>NGÀY TẠO</th>
                    <th>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={
                        selectedUsers.includes(user.id) ? "selected-row" : ""
                      }
                    >
                      <td data-label="" className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="select-checkbox"
                        />
                      </td>
                      <td data-label="ID">{user.id.substring(0, 8)}...</td>
                      <td data-label="HỌ TÊN">{user.name}</td>
                      <td data-label="EMAIL">{user.email}</td>
                      <td data-label="VAI TRÒ">
                        <span
                          className={`role-badge ${
                            user.role === "admin" ? "role-admin" : "role-user"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Đoàn viên"}
                        </span>
                      </td>
                      <td data-label="NGÀY TẠO">{user.createdAt}</td>
                      <td data-label="HÀNH ĐỘNG">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditButton(user)}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {viewMode === "add" && (
          <div className="user-form-container">
            <h2>Thêm Người Dùng Mới</h2>

            {formError && <div className="form-error">{formError}</div>}
            {formSuccess && <div className="form-success">{formSuccess}</div>}

            <form className="user-form" onSubmit={handleAddUser}>
              <div className="form-group">
                <label htmlFor="name">Họ và Tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">Đoàn viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {showAdminCode && (
                <div className="form-group">
                  <label htmlFor="adminCode">Mã xác thực Admin</label>
                  <input
                    type="text"
                    id="adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="submit-form-action">
                  Thêm Người Dùng
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setViewMode("list")}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {viewMode === "edit" && selectedUser && (
          <div className="user-form-container">
            <h2>Chỉnh Sửa Người Dùng</h2>

            {formError && <div className="form-error">{formError}</div>}
            {formSuccess && <div className="form-success">{formSuccess}</div>}

            <form className="user-form" onSubmit={handleEditUser}>
              <div className="form-group">
                <label htmlFor="name">Họ và Tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Mật khẩu (để trống nếu không thay đổi)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới hoặc để trống"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">Đoàn viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {showAdminCode && (
                <div className="form-group">
                  <label htmlFor="adminCode">Mã xác thực Admin</label>
                  <input
                    type="text"
                    id="adminCode"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    required={
                      formData.role === "admin" && selectedUser.role !== "admin"
                    }
                    placeholder="Chỉ cần khi thăng cấp lên Admin"
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Cập Nhật
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => {
                    setViewMode("list");
                    setSelectedUser(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAdminAuth(UsersDashboard);
