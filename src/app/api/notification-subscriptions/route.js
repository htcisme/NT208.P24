import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import NotificationSubscription from "@/models/NotificationSubscription";
import { getServerSession } from "next-auth/next";
import nodemailer from "nodemailer";

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm lấy domain từ request URL
function getDomainFromRequest(request) {
  try {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    console.error("Lỗi khi lấy domain:", error);
    return "http://localhost:3000"; // Fallback domain
  }
}

// Hàm gửi email với logging chi tiết
async function sendEmailWithLogging(mailOptions) {
  try {
    console.log("=== Bắt đầu gửi email xác nhận đăng ký ===");
    console.log("Từ:", mailOptions.from);
    console.log("Đến:", mailOptions.to);
    console.log("Tiêu đề:", mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);

    console.log("=== Email xác nhận gửi thành công ===");
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    console.log("=========================");

    return { success: true, info };
  } catch (error) {
    console.error("=== Lỗi khi gửi email xác nhận ===");
    console.error("Lỗi:", error.message);
    console.error("Stack:", error.stack);
    console.error("=========================");
    return { success: false, error };
  }
}

// GET - Lấy tất cả thông báo đăng ký của người dùng
export async function GET(request) {
  try {
    await dbConnect();
    console.log("=== Bắt đầu lấy danh sách đăng ký ===");

    const subscriptions = await NotificationSubscription.find({
      isActive: true,
    }).select("name email topics lastNotified createdAt");

    console.log(`Tìm thấy ${subscriptions.length} đăng ký đang hoạt động`);
    console.log("=== Hoàn thành lấy danh sách đăng ký ===");

    return NextResponse.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.error("=== Lỗi khi lấy danh sách đăng ký ===");
    console.error("Lỗi:", error.message);
    console.error("Stack:", error.stack);
    console.error("=========================");

    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách đăng ký" },
      { status: 500 }
    );
  }
}

// POST - Đăng ký nhận thông báo mới
export async function POST(request) {
  try {
    await dbConnect();
    console.log("=== Bắt đầu xử lý đăng ký nhận thông báo ===");

    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      console.error("Thiếu thông tin bắt buộc:", { name, email });
      return NextResponse.json(
        { success: false, message: "Vui lòng cung cấp đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingSubscription = await NotificationSubscription.findOne({
      email,
    });
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        console.log(`Email ${email} đã đăng ký và đang hoạt động`);
        return NextResponse.json(
          { success: false, message: "Email này đã được đăng ký" },
          { status: 400 }
        );
      } else {
        // Nếu đã tồn tại nhưng không active, cập nhật lại
        console.log(`Cập nhật lại đăng ký cho email ${email}`);
        existingSubscription.isActive = true;
        existingSubscription.name = name;
        await existingSubscription.save();
      }
    } else {
      // Tạo đăng ký mới
      console.log(`Tạo đăng ký mới cho email ${email}`);
      await NotificationSubscription.create({
        name,
        email,
        isActive: true,
        topics: ["newPosts"],
      });
    }

    // Lấy domain từ request
    const domain = getDomainFromRequest(request);
    console.log("Domain hiện tại:", domain);
    const logoUrl = `${domain}/Img/Homepage/Fulllogolight.png`;
    const heroImgUrl = `${domain}/Img/Homepage/Hero.png`;

    // Gửi email xác nhận
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác nhận đăng ký nhận thông báo - Đoàn khoa MMT&TT",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <!-- Header với logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Logo Đoàn khoa MMT&TT" style="max-width: 200px; height: auto;">
          </div>

          <!-- Tiêu đề -->
          <div style="background-color: #042354; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; text-align: center;">Xác nhận đăng ký nhận thông báo</h2>
          </div>

          <!-- Nội dung chính -->
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Cảm ơn bạn đã đăng ký nhận thông báo từ Đoàn khoa Mạng máy tính và Truyền thông.</p>
            
            <!-- Hình ảnh minh họa -->
            <div style="text-align: center; margin: 20px 0;">
              <img src="${heroImgUrl}" alt="Hoạt động Đoàn khoa" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>

            <p style="font-size: 16px; color: #333;">Bạn sẽ nhận được thông báo về:</p>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0;">📢</span>
                Hoạt động mới
              </li>
              <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0;">📅</span>
                Cập nhật về các sự kiện
              </li>
              <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0;">📌</span>
                Thông tin quan trọng khác
              </li>
            </ul>

            <!-- Nút hủy đăng ký với xác nhận -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${domain}/Unsubscribe?email=${encodeURIComponent(
        email
      )}" 
                 onclick="return confirm('Bạn có chắc chắn muốn hủy đăng ký nhận thông báo?');"
                 style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s;">
                Hủy đăng ký
              </a>
            </div>

            <!-- Thông tin về hủy đăng ký -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Lưu ý:</strong> Khi hủy đăng ký, bạn sẽ không còn nhận được thông báo về các hoạt động mới. 
                Bạn có thể đăng ký lại bất cứ lúc nào.
              </p>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="font-size: 12px; color: #666; margin: 0;">
                Đây là email tự động, vui lòng không trả lời email này.<br>
                © 2024 Đoàn khoa Mạng máy tính và Truyền thông
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const emailResult = await sendEmailWithLogging(mailOptions);
    if (!emailResult.success) {
      console.error("Không thể gửi email xác nhận:", emailResult.error);
      // Vẫn trả về thành công cho người dùng vì đăng ký đã được lưu
    }

    console.log("=== Hoàn thành xử lý đăng ký ===");
    return NextResponse.json({
      success: true,
      message: "Đăng ký nhận thông báo thành công",
    });
  } catch (error) {
    console.error("=== Lỗi khi xử lý đăng ký ===");
    console.error("Lỗi:", error.message);
    console.error("Stack:", error.stack);
    console.error("=========================");

    return NextResponse.json(
      { success: false, message: "Lỗi khi đăng ký nhận thông báo" },
      { status: 500 }
    );
  }
}

// DELETE - Hủy đăng ký nhận thông báo
export async function DELETE(request) {
  try {
    await dbConnect();

    // Lấy userId từ query params hoặc từ session
    const url = new URL(request.url);
    let userId = url.searchParams.get("userId");

    // Nếu không có userId trong query, thử lấy từ session
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (session && session.user) {
        userId = session.user.id;
      }
    }

    // Vẫn không có userId -> trả về lỗi
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Thiếu userId" },
        { status: 400 }
      );
    }

    // Thay vì xóa, cập nhật thành không hoạt động
    const result = await NotificationSubscription.findOneAndUpdate(
      { userId },
      { isActive: false },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đăng ký" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hủy đăng ký thông báo thành công",
    });
  } catch (error) {
    console.error("Error unsubscribing notifications:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi hủy đăng ký thông báo" },
      { status: 500 }
    );
  }
}
