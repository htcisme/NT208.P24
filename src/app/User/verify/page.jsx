"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "./../style.css";

export default function VerifyAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  async function handleVerify(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/users/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.expired) {
          throw new Error("Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.");
        }
        throw new Error(data.message || "Xác thực thất bại");
      }

      setSuccess(data.message || "Xác thực thành công");

      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/User?tab=login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    setResendLoading(true);
    setError("");
    setResendSuccess("");

    try {
      const response = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể gửi lại mã");
      }

      setResendSuccess("Mã xác thực mới đã được gửi đến email của bạn");
      setTimeLeft(60); // Set cooldown timer to 60 seconds
    } catch (error) {
      setError(error.message);
    } finally {
      setResendLoading(false);
    }
  }

  if (!email) {
    return (
      <div className="verify-page-wrapper">
        <div className="verification-container">
          <h1>Lỗi</h1>
          <p>Không tìm thấy email để xác thực. Vui lòng thử đăng ký lại.</p>
          <Link href="/User?tab=register" className="back-link">
            Quay lại trang đăng ký
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page-wrapper">
      <div className="verification-container">
        <h1>Xác minh tài khoản</h1>
        <p className="verification-info">
          Vui lòng nhập mã xác thực đã được gửi đến email:{" "}
          <strong>{email}</strong>
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {resendSuccess && (
          <div className="success-message">{resendSuccess}</div>
        )}

        <form onSubmit={handleVerify} className="verification-form">
          <div className="verification-code-input">
            <label htmlFor="verification-code">Mã xác thực</label>
            <input
              type="text"
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Nhập mã 6 số"
              required
              maxLength="6"
            />
          </div>

          <button type="submit" className="verify-button" disabled={isLoading}>
            {isLoading ? "Đang xác thực..." : "Xác thực"}
          </button>
        </form>

        <div className="resend-code">
          <button
            onClick={handleResendCode}
            className="resend-button"
            disabled={resendLoading || timeLeft > 0}
          >
            {resendLoading
              ? "Đang gửi..."
              : timeLeft > 0
              ? `Gửi lại mã (${timeLeft}s)`
              : "Gửi lại mã"}
          </button>
        </div>

        <Link href="/User?tab=login" className="back-link">
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
}
