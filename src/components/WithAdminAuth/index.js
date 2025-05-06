"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAdminAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.role === "admin") {
              setIsAuthenticated(true);
            } else {
              router.push("/");
            }
          } else {
            router.push("/User?tab=login");
          }
        } catch (error) {
          console.error("Auth check error:", error);
          router.push("/User?tab=login");
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
