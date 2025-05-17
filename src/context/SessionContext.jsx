"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SessionContext = createContext();

// Hàm debounce để tránh gọi API quá nhiều lần
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function SessionProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sessionTimeoutRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const activityHandlerRef = useRef(null);
  const lastRefreshRef = useRef(0);

  // Reset session timeout when there's activity
  const resetSessionTimeout = () => {
    console.log("Reset session timeout called");

    if (!user) {
      console.log("No user found, returning early");
      return;
    }

    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe) {
      console.log("Remember me is active, skipping session timeout");
      return;
    }

    // Không gọi API nếu đang trong quá trình refresh
    if (isRefreshing) {
      console.log("Already refreshing, skipping");
      return;
    }

    setIsRefreshing(true);

    // Clear existing timeouts
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    setSessionExpiring(false);

    const userId = user.id;
    if (!userId) {
      setIsRefreshing(false);
      return;
    }

    // Call API to refresh the session
    fetch("/api/users/refresh-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          document.cookie = `token=${data.token}; path=/; max-age=120`; // 2 minutes

          // Set a new timeout that will show the warning 30 seconds before expiration
          activityTimeoutRef.current = setTimeout(() => {
            setSessionExpiring(true);
            setTimeLeft(30);

            // Set interval to count down
            countdownIntervalRef.current = setInterval(() => {
              setTimeLeft((prev) => {
                if (prev <= 1) {
                  clearInterval(countdownIntervalRef.current);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);

            // Set timeout to logout after 30 seconds of inactivity
            sessionTimeoutRef.current = setTimeout(() => {
              handleLogout();
            }, 30000);
          }, data.sessionTimeout - 30000); // Show warning 30 seconds before timeout
        }
      })
      .catch((err) => {
        console.error("Error refreshing session:", err);
      })
      .finally(() => {
        setIsRefreshing(false);
        lastRefreshRef.current = Date.now();
      });
  };

  // Handle logout
  const handleLogout = () => {
    // Đầu tiên, đặt lại sessionExpiring thành false
    setSessionExpiring(false);
    setTimeLeft(0);
    // Clear all timeouts and intervals
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    // Remove event listeners
    removeActivityListeners();

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);

    // Redirect to login page
    const currentPath = window.location.pathname;
    if (!currentPath.includes("/User")) {
      // Redirect to login page
      router.push("/User?tab=login");
    }
  };

  // Function to add activity event listeners - với debouncing và điều kiện
  const addActivityListeners = () => {
    const activityEvents = ["mousedown", "keypress", "scroll", "touchstart"];

    // Xóa "mousemove" khỏi danh sách events vì nó gây ra quá nhiều sự kiện

    // Chỉ xử lý sự kiện khi KHÔNG hiển thị popup và không refresh quá thường xuyên
    const debouncedActivityHandler = debounce((e) => {
      const now = Date.now();
      // Chỉ refresh nếu không hiển thị popup và đã ít nhất 10 giây kể từ lần refresh cuối
      if (!sessionExpiring && now - lastRefreshRef.current > 10000) {
        resetSessionTimeout();
      }
    }, 1000); // Debounce 1 giây

    // Lưu reference để có thể remove chính xác handler sau này
    activityHandlerRef.current = debouncedActivityHandler;

    activityEvents.forEach((event) => {
      document.addEventListener(event, debouncedActivityHandler);
    });
  };

  // Function to remove activity event listeners
  const removeActivityListeners = () => {
    const activityEvents = ["mousedown", "keypress", "scroll", "touchstart"];

    if (activityHandlerRef.current) {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, activityHandlerRef.current);
      });
    }
  };

  // Check user on mount and set up activity tracking
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

  // Set up activity tracking whenever user changes
  useEffect(() => {
    if (!user) return;

    // Add event listeners
    addActivityListeners();

    // Initial session timeout
    resetSessionTimeout();

    // Cleanup
    return () => {
      removeActivityListeners();
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [user]);

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        sessionExpiring,
        timeLeft,
        resetSessionTimeout,
        handleLogout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
