"use client";
import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import "./style.css";

// Advanced Avatar Component using your SVG
function AdvancedAvatar({ isPasswordFocused, onAnimationComplete }) {
  const avatarRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);
  const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isPasswordFocused && avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Giới hạn chuyển động mắt
        const maxDistance = 50;
        const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance));
        const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDistance));

        setEyeDirection({ x: normalizedX * 3, y: normalizedY * 2 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPasswordFocused]);

  // Idle animation
  useEffect(() => {
    const idleInterval = setInterval(() => {
      if (!isPasswordFocused && isIdle) {
        setIsIdle(false);
        setTimeout(() => setIsIdle(true), 2000);
      }
    }, 4000);

    return () => clearInterval(idleInterval);
  }, [isPasswordFocused, isIdle]);

  // Animation cho tay che mắt
  useEffect(() => {
    if (avatarRef.current) {
      const armL = avatarRef.current.querySelector(".armL");
      const armR = avatarRef.current.querySelector(".armR");

      if (isPasswordFocused) {
        // Hiện tay che mắt
        if (armL) armL.style.visibility = "visible";
        if (armR) armR.style.visibility = "visible";
      } else {
        // Ẩn tay
        if (armL) armL.style.visibility = "hidden";
        if (armR) armR.style.visibility = "hidden";
      }
    }
  }, [isPasswordFocused]);

  return (
    <div className="advanced-avatar-container">
      <div
        ref={avatarRef}
        className={`advanced-avatar-wrapper ${
          isPasswordFocused ? "password-focused" : ""
        } ${onAnimationComplete ? "success-animation" : ""}`}
      >
        <svg
          className="advanced-avatar-svg"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 200 200"
        >
          <defs>
            <circle id="armMaskPath" cx="100" cy="100" r="100" />
          </defs>
          <clipPath id="armMask">
            <use xlinkHref="#armMaskPath" overflow="visible" />
          </clipPath>

          {/* Background circle */}
          <circle cx="100" cy="100" r="100" fill="#a9ddf3" />

          {/* Body */}
          <g className="body">
            <path
              className="bodyBGnormal"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#FFFFFF"
              d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
            />
            <path
              fill="#DDF1FA"
              d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"
            />
          </g>

          {/* Ears */}
          <g className="earL">
            <g
              className="outerEar"
              fill="#ddf1fa"
              stroke="#3a5e77"
              strokeWidth="2.5"
            >
              <circle cx="47" cy="83" r="11.5" />
              <path
                d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <g className="earHair">
              <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
              <path
                d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
                fill="#fff"
                stroke="#3a5e77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>

          <g className="earR">
            <g className="outerEar">
              <circle
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                cx="153"
                cy="83"
                r="11.5"
              />
              <path
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"
              />
            </g>
            <g className="earHair">
              <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
              <path
                fill="#FFFFFF"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"
              />
            </g>
          </g>

          {/* Face */}
          <path
            className="face"
            fill="#DDF1FA"
            d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
          />

          {/* Hair */}
          <path
            className="hair"
            fill="#FFFFFF"
            stroke="#3A5E77"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"
          />

          {/* Eyebrow */}
          <g className="eyebrow">
            <path
              fill="#FFFFFF"
              d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"
            />
            <path
              fill="#FFFFFF"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"
            />
          </g>

          {/* Eyes with tracking */}
          <g className="eyeL">
            <circle
              cx={85.5 + eyeDirection.x}
              cy={78.5 + eyeDirection.y}
              r="3.5"
              fill="#3a5e77"
              style={{
                transition: isPasswordFocused ? "none" : "all 0.1s ease",
                opacity: isPasswordFocused ? 0 : 1,
              }}
            />
            <circle
              cx={84 + eyeDirection.x}
              cy={76 + eyeDirection.y}
              r="1"
              fill="#fff"
              style={{
                transition: isPasswordFocused ? "none" : "all 0.1s ease",
                opacity: isPasswordFocused ? 0 : 1,
              }}
            />
          </g>

          <g className="eyeR">
            <circle
              cx={114.5 + eyeDirection.x}
              cy={78.5 + eyeDirection.y}
              r="3.5"
              fill="#3a5e77"
              style={{
                transition: isPasswordFocused ? "none" : "all 0.1s ease",
                opacity: isPasswordFocused ? 0 : 1,
              }}
            />
            <circle
              cx={113 + eyeDirection.x}
              cy={76 + eyeDirection.y}
              r="1"
              fill="#fff"
              style={{
                transition: isPasswordFocused ? "none" : "all 0.1s ease",
                opacity: isPasswordFocused ? 0 : 1,
              }}
            />
          </g>

          {/* Nose */}
          <path
            className="nose"
            d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"
            fill="#3a5e77"
          />

          {/* Mouth */}
          <g className="mouth">
            <path
              className="mouthBG"
              fill="#617E92"
              d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
            />
            <defs>
              <path
                id="mouthMaskPath"
                d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
              />
            </defs>
            <clipPath id="mouthMask">
              <use xlinkHref="#mouthMaskPath" overflow="visible" />
            </clipPath>
            <path
              className="mouthOutline"
              fill="none"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinejoin="round"
              d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
            />
          </g>

          {/* Arms - che mắt khi focus vào password */}
          <g className="arms" clipPath="url(#armMask)">
            <g
              className="armL"
              style={{
                visibility: isPasswordFocused ? "visible" : "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <polygon
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"
              />
              <path
                fill="#FFFFFF"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8"
              />
            </g>
            <g
              className="armR"
              style={{
                visibility: isPasswordFocused ? "visible" : "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <path
                fill="#ddf1fa"
                stroke="#3a5e77"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                strokeWidth="2.5"
                d="M78.7 98.4L89 59.7 50.2 49.3 30.2 85.4z"
              />
              <path
                fill="#FFFFFF"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M76.5,97.8 c41.4,14.9,84.1,30.7,108.2,35.5L198.8,81c-33.5-9.9-71.9-16.5-111.9-21.8"
              />
            </g>
          </g>

          {/* Success animation particles */}
          {onAnimationComplete && (
            <g className="success-particles">
              <circle cx="50" cy="40" r="3" fill="#4ecdc4" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="2;4;2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="150" cy="35" r="2" fill="#45b7d1" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="80" cy="25" r="2.5" fill="#96ceb4" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="2s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
// Polar Bear Avatar Component
function PolarBearAvatar({ isPasswordFocused, onAnimationComplete }) {
  const avatarRef = useRef(null);
  const eyesRef = useRef({ left: null, right: null });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isPasswordFocused) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPasswordFocused]);

  // Idle animation
  useEffect(() => {
    const idleInterval = setInterval(() => {
      if (!isPasswordFocused && isIdle) {
        // Trigger blink or head tilt animation
        setIsIdle(false);
        setTimeout(() => setIsIdle(true), 1000);
      }
    }, 3000);

    return () => clearInterval(idleInterval);
  }, [isPasswordFocused, isIdle]);

  const calculateEyePosition = () => {
    if (!avatarRef.current) return { x: 0, y: 0 };

    const rect = avatarRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(
      mousePosition.y - centerY,
      mousePosition.x - centerX
    );
    const distance = Math.min(
      8,
      Math.sqrt(
        Math.pow(mousePosition.x - centerX, 2) +
          Math.pow(mousePosition.y - centerY, 2)
      ) / 20
    );

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const eyePosition = calculateEyePosition();

  return (
    <div className="polar-bear-avatar-container">
      <svg
        ref={avatarRef}
        className="polar-bear-avatar"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Polar Bear Body */}
        <ellipse
          cx="100"
          cy="140"
          rx="45"
          ry="35"
          fill="#f8f9fa"
          stroke="#e9ecef"
          strokeWidth="2"
        />

        {/* Polar Bear Head */}
        <circle
          cx="100"
          cy="90"
          r="50"
          fill="#ffffff"
          stroke="#e9ecef"
          strokeWidth="2"
        />

        {/* Ears */}
        <circle
          cx="75"
          cy="55"
          r="15"
          fill="#ffffff"
          stroke="#e9ecef"
          strokeWidth="2"
        />
        <circle
          cx="125"
          cy="55"
          r="15"
          fill="#ffffff"
          stroke="#e9ecef"
          strokeWidth="2"
        />
        <circle cx="75" cy="55" r="8" fill="#f8f9fa" />
        <circle cx="125" cy="55" r="8" fill="#f8f9fa" />

        {/* Arms */}
        {isPasswordFocused ? (
          <>
            {/* Covering eyes pose */}
            <ellipse
              cx="60"
              cy="85"
              rx="12"
              ry="20"
              fill="#ffffff"
              stroke="#e9ecef"
              strokeWidth="2"
              transform="rotate(-30 60 85)"
            />
            <ellipse
              cx="140"
              cy="85"
              rx="12"
              ry="20"
              fill="#ffffff"
              stroke="#e9ecef"
              strokeWidth="2"
              transform="rotate(30 140 85)"
            />
            {/* Paws covering eyes */}
            <circle cx="70" cy="75" r="8" fill="#f8f9fa" />
            <circle cx="130" cy="75" r="8" fill="#f8f9fa" />
          </>
        ) : (
          <>
            {/* Normal arms */}
            <ellipse
              cx="60"
              cy="110"
              rx="12"
              ry="25"
              fill="#ffffff"
              stroke="#e9ecef"
              strokeWidth="2"
              transform="rotate(-15 60 110)"
            />
            <ellipse
              cx="140"
              cy="110"
              rx="12"
              ry="25"
              fill="#ffffff"
              stroke="#e9ecef"
              strokeWidth="2"
              transform="rotate(15 140 110)"
            />
            {/* Paws */}
            <circle cx="55" cy="125" r="8" fill="#f8f9fa" />
            <circle cx="145" cy="125" r="8" fill="#f8f9fa" />
          </>
        )}

        {/* Eyes */}
        {!isPasswordFocused && (
          <>
            <circle
              cx={85 + eyePosition.x}
              cy={80 + eyePosition.y}
              r="6"
              fill="#2c3e50"
            />
            <circle
              cx={115 + eyePosition.x}
              cy={80 + eyePosition.y}
              r="6"
              fill="#2c3e50"
            />
            {/* Eye shine */}
            <circle
              cx={87 + eyePosition.x}
              cy={77 + eyePosition.y}
              r="2"
              fill="#ffffff"
            />
            <circle
              cx={117 + eyePosition.x}
              cy={77 + eyePosition.y}
              r="2"
              fill="#ffffff"
            />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="95" rx="3" ry="2" fill="#2c3e50" />

        {/* Mouth */}
        <path
          d="M 95 105 Q 100 110 105 105"
          stroke="#2c3e50"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Blush (when idle) */}
        {isIdle && (
          <>
            <circle cx="70" cy="95" r="4" fill="#ff6b8a" opacity="0.3" />
            <circle cx="130" cy="95" r="4" fill="#ff6b8a" opacity="0.3" />
          </>
        )}

        {/* Success animation particles (can be triggered) */}
        {onAnimationComplete && (
          <>
            <circle cx="50" cy="40" r="2" fill="#4ecdc4" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="150" cy="35" r="2" fill="#45b7d1" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80" cy="25" r="1.5" fill="#96ceb4" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

function UserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const {
    user,
    setUser,
    sessionExpiring,
    timeLeft,
    resetSessionTimeout,
    handleLogout,
  } = useSession();

  // State cho avatar
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // ...existing state...
  const [activeTab, setActiveTab] = useState(
    tabParam === "login" ? "login" : "register"
  );

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    adminCode: "",
  });
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // ...existing effects and handlers...
  useEffect(() => {
    setActiveTab(tabParam === "login" ? "login" : "register");
  }, [tabParam]);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...registerFormData,
      [name]: value,
    };

    // Validation cho trường name - không cho phép số
    if (name === "name") {
      // Loại bỏ tất cả các ký tự số
      const nameWithoutNumbers = value.replace(/[0-9]/g, "");
      updatedFormData = {
        ...registerFormData,
        [name]: nameWithoutNumbers,
      };
    }

    if (name === "role") {
      if (value === "admin") {
        setShowAdminCode(true);
      } else if (value === "user") {
        setShowAdminCode(false);
        updatedFormData.adminCode = "";
      }
    }

    setRegisterFormData(updatedFormData);

    if (
      (name === "password" || name === "confirmPassword") &&
      updatedFormData.password &&
      updatedFormData.confirmPassword
    ) {
      setPasswordsMatch(
        updatedFormData.password === updatedFormData.confirmPassword
      );
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    setVerificationNeeded(false);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) {
          setVerificationNeeded(true);
          setVerificationEmail(data.email);
          throw new Error(data.message);
        }
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Success animation
      setShowSuccessAnimation(true);

      localStorage.setItem("rememberMe", loginFormData.rememberMe);
      localStorage.setItem("token", data.token);

      if (loginFormData.rememberMe) {
        // Persistent cookie - 7 ngày
        document.cookie = `token=${data.token}; path=/; max-age=604800`;
      } else {
        // Session cookie - hết hạn khi đóng browser (không có max-age)
        document.cookie = `token=${data.token}; path=/`;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerFormData.password !== registerFormData.confirmPassword) {
      setRegisterError("Mật khẩu nhập lại không khớp");
      setPasswordsMatch(false);
      return;
    }

    setIsRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const submitData = { ...registerFormData };
      delete submitData.confirmPassword;

      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Success animation
      setShowSuccessAnimation(true);

      setRegisterSuccess(
        data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản."
      );

      setRegisterFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        adminCode: "",
      });
      setShowAdminCode(false);

      setTimeout(() => {
        router.push(`/User/verify?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleGoToVerification = () => {
    router.push(`/User/verify?email=${encodeURIComponent(verificationEmail)}`);
  };

  return (
    <div className="page-container">
      {sessionExpiring && (
        <div className="session-timeout-warning">
          <div className="session-timeout-content">
            <h3>Phiên làm việc sắp hết hạn</h3>
            <p>Phiên làm việc của bạn sẽ hết hạn trong {timeLeft} giây.</p>
            <p>Bạn có muốn tiếp tục?</p>
            <div className="session-timeout-actions">
              <button
                className="session-extend-btn"
                onClick={resetSessionTimeout}
              >
                Tiếp tục phiên làm việc
              </button>
              <button className="session-logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-container">
        {/* Advanced Avatar thay thế cho Polar Bear Avatar */}
        <AdvancedAvatar
          isPasswordFocused={isPasswordFocused}
          onAnimationComplete={showSuccessAnimation}
        />

        {/* Tabs */}
        <div className="tab-container">
          <div
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </div>
          <div
            className={`tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Đăng ký
          </div>
        </div>

        <div className="form-slider">
          <div
            className="form-wrapper"
            style={{
              transform:
                activeTab === "login" ? "translateX(0%)" : "translateX(-100%)",
            }}
          >
            <div className="form-content">
              {/* Login Form */}
              {activeTab === "login" && (
                <div id="login-form" className="active">
                  <h3 className="form-title">Đăng nhập với tài khoản</h3>

                  {loginError && (
                    <div className="error-message">
                      {loginError}
                      {verificationNeeded && (
                        <button
                          className="verification-redirect-btn"
                          onClick={handleGoToVerification}
                        >
                          Xác minh ngay
                        </button>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Nhập email"
                        value={loginFormData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Mật khẩu</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={loginFormData.password}
                        onChange={handleLoginChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        required
                      />
                    </div>

                    <div className="form-group form-checkbox">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={loginFormData.rememberMe}
                        onChange={handleLoginChange}
                      />
                      <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                    </div>

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <div className="form-note">
                      <a href="#">Quên mật khẩu?</a>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="form-content">
              {/* Register Form */}
              {activeTab === "register" && (
                <div id="register-form" className="active">
                  <h3 className="form-title">Đăng ký với tài khoản</h3>

                  {registerError && (
                    <div className="error-message">{registerError}</div>
                  )}

                  {registerSuccess && (
                    <div className="success-message">{registerSuccess}</div>
                  )}

                  <form onSubmit={handleRegisterSubmit}>
                    <div className="form-group">
                      <label htmlFor="register-name">Họ và Tên</label>
                      <input
                        type="text"
                        className="form-control"
                        id="register-name"
                        name="name"
                        placeholder="Nhập tên"
                        value={registerFormData.name}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="register-email"
                        name="email"
                        placeholder="Nhập Email"
                        value={registerFormData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-password">Mật khẩu</label>
                      <input
                        type="password"
                        className="form-control"
                        id="register-password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={registerFormData.password}
                        onChange={handleRegisterChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm-password">
                        Nhập lại mật khẩu
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          registerFormData.confirmPassword && !passwordsMatch
                            ? "password-mismatch"
                            : ""
                        }`}
                        id="confirm-password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={registerFormData.confirmPassword}
                        onChange={handleRegisterChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        required
                        minLength="6"
                      />
                      {registerFormData.confirmPassword && !passwordsMatch && (
                        <div className="password-mismatch-message">
                          Mật khẩu không khớp
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-role">Vai trò</label>
                      <select
                        className="form-control"
                        id="register-role"
                        name="role"
                        value={registerFormData.role}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="user">Đoàn viên</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {showAdminCode && (
                      <div className="form-group">
                        <label htmlFor="admin-code">Mã xác thực Admin</label>
                        <input
                          type="text"
                          className="form-control"
                          id="admin-code"
                          name="adminCode"
                          placeholder="Nhập mã xác thực Admin"
                          value={registerFormData.adminCode}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isRegisterLoading}
                    >
                      {isRegisterLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>

                    <div className="disclaimer">
                      Bằng cách đăng ký tài khoản, bạn cũng đồng thời chấp nhận
                      mọi{" "}
                      <em>
                        điều kiện về quy định và chính sách của Đoàn khoa Mạng
                        máy tính và Truyền thông
                      </em>
                      .
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function User() {
  return (
    <Suspense
      fallback={<div className="form-container loading">Đang tải...</div>}
    >
      <UserContent />
    </Suspense>
  );
}
