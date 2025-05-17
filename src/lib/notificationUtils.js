import dbConnect from "@/lib/mongodb";

/**
 * Gửi thông báo FCM đến các token thiết bị cụ thể
 * @param {string[]} recipients - Mảng các token FCM
 * @param {string} title - Tiêu đề thông báo
 * @param {string} body - Nội dung thông báo
 * @param {object} data - Dữ liệu bổ sung đi kèm thông báo
 */
export async function sendNotification(recipients, title, body, data = {}) {
  try {
    // Kiểm tra môi trường
    if (typeof window !== "undefined") {
      console.error("sendNotification chỉ nên được gọi từ server-side code");
      return;
    }

    if (!recipients || recipients.length === 0) {
      console.warn("Không có người nhận thông báo");
      return;
    }

    const fcmServerKey = process.env.FCM_SERVER_KEY;
    if (!fcmServerKey) {
      console.error("Thiếu FCM_SERVER_KEY trong biến môi trường");
      return;
    }

    // Gửi thông báo cho từng token
    const results = await Promise.allSettled(
      recipients.map(async (token) => {
        try {
          const payload = {
            notification: {
              title,
              body,
              icon: "/favicon.ico",
              click_action: data.url || "/",
            },
            data: {
              ...data,
              url: data.url || "/",
              // Đảm bảo tất cả giá trị là string như FCM yêu cầu
              ...Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, String(value)])
              ),
            },
            to: token,
          };

          const response = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `key=${fcmServerKey}`,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`FCM responded with status: ${response.status}`);
          }

          const result = await response.json();
          console.log(
            `FCM notification sent to token ${token.substring(0, 10)}...`,
            result
          );
          return { token, success: true, result };
        } catch (err) {
          console.error(
            `Error sending FCM notification to token ${token.substring(
              0,
              10
            )}...`,
            err
          );
          return { token, success: false, error: err.message };
        }
      })
    );

    // Phân tích kết quả
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - successful;

    console.log(
      `FCM notifications summary: ${successful} successful, ${failed} failed`
    );
    return { successful, failed, details: results };
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return {
      successful: 0,
      failed: recipients?.length || 0,
      error: error.message,
    };
  }
}

/**
 * Lấy danh sách token FCM từ người dùng đăng ký nhận thông báo
 * @param {string} topic - Chủ đề thông báo (mặc định: "newPosts")
 * @returns {Promise<string[]>} - Mảng các token FCM
 */
export async function getSubscribedTokens(topic = "newPosts") {
  try {
    await dbConnect();

    // Import model PushSubscription - model thích hợp để lưu token FCM
    // (Đây là giả định, cần điều chỉnh tùy theo mô hình dữ liệu thực tế của bạn)
    const PushSubscription = (await import("@/models/PushSubscription"))
      .default;

    // Lấy tất cả token đăng ký và đang hoạt động
    const subscriptions = await PushSubscription.find({
      isActive: true,
      topics: topic,
    }).lean();

    const tokens = subscriptions.map((sub) => sub.token);
    console.log(`Tìm thấy ${tokens.length} token đăng ký cho topic "${topic}"`);
    return tokens;
  } catch (error) {
    console.error("Error fetching subscribed tokens:", error);
    return [];
  }
}
