"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "@/styles-comp/style.css";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      if (!email) {
        setStatus("error");
        setMessage("Email không hợp lệ");
        return;
      }

      try {
        const response = await fetch("/api/notification-subscriptions/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Bạn đã hủy đăng ký nhận thông báo thành công.");
        } else {
          setStatus("error");
          setMessage(data.message || "Có lỗi xảy ra khi hủy đăng ký.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Có lỗi xảy ra khi xử lý yêu cầu của bạn.");
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="unsubscribe-container" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1 style={{
          color: "#042354",
          marginBottom: "20px"
        }}>
          Hủy đăng ký nhận thông báo
        </h1>

        {status === "loading" && (
          <div style={{ color: "#666" }}>
            Đang xử lý yêu cầu của bạn...
          </div>
        )}

        {status === "success" && (
          <div style={{ color: "#28a745" }}>
            <p style={{ marginBottom: "20px" }}>{message}</p>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Bạn có thể đăng ký lại bất cứ lúc nào để nhận thông báo về các hoạt động mới.
            </p>
          </div>
        )}

        {status === "error" && (
          <div style={{ color: "#dc3545" }}>
            <p style={{ marginBottom: "20px" }}>{message}</p>
          </div>
        )}

        <div style={{ marginTop: "30px" }}>
          <Link href="/" style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#042354",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s"
          }}>
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 