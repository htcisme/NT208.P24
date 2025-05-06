import jwt from "jsonwebtoken";

export function verifyAuth() {
  // Kiểm tra nếu chạy phía client
  if (typeof window !== "undefined") {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");
      if (!token) return null;

      // Kiểm tra JWT token hết hạn
      const decodedToken = jwt.decode(token);

      if (!decodedToken) return null;

      // Kiểm tra thời gian hết hạn
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Token hết hạn, xóa khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }

      // Token còn hiệu lực, lấy thông tin người dùng
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Auth verification error:", error);
      return null;
    }
  }
  return null;
}

export function verifyAdmin(token) {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user?.role === "admin";
  } catch (error) {
    return false;
  }
}
