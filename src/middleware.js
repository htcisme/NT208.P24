import { NextResponse } from "next/server";

export function middleware(request) {
  // Lấy token từ cookie
  const token = request.cookies.get("token")?.value;

  // Kiểm tra path có bắt đầu bằng /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    if (!token) {
      return NextResponse.redirect(new URL("/User?tab=login", request.url));
    }

    // Nếu có token, sẽ để middleware client side xử lý việc kiểm tra vai trò admin
    // vì middleware.js không thể truy cập localStorage
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các path bắt đầu bằng /admin
export const config = {
  matcher: ["/admin/:path*"],
};
