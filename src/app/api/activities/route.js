import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Notification from "@/models/Notification";
import User from "@/models/User";
import NotificationSubscription from "@/models/NotificationSubscription";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import fs from "fs";
import nodemailer from "nodemailer";

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm gửi email với logging chi tiết
async function sendEmailWithLogging(mailOptions) {
  try {
    console.log("=== Bắt đầu gửi email ===");
    console.log("Từ:", mailOptions.from);
    console.log("Đến:", mailOptions.to);
    console.log("Tiêu đề:", mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);

    console.log("=== Email gửi thành công ===");
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    console.log("=========================");

    return { success: true, info };
  } catch (error) {
    console.error("=== Lỗi khi gửi email ===");
    console.error("Lỗi:", error.message);
    console.error("Stack:", error.stack);
    console.error("=========================");
    return { success: false, error };
  }
}

// Hàm tạo token duy nhất bằng JWT
function generateUniqueToken(userId, title = "") {
  try {
    if (!userId) {
      console.error("UserId is required for token generation");
      return Date.now().toString(); // Fallback nếu không có userId
    }

    const payload = {
      uid: userId.toString(),
      title,
      ts: Date.now(),
    };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return Date.now().toString(); // Fallback nếu không có JWT_SECRET
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return Date.now().toString(); // Fallback nếu có lỗi
  }
}

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

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 8;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const query = status ? { status } : { status: "published" };

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-comments")
      .lean();

    const total = await Activity.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách hoạt động" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    console.log("=== Bắt đầu tạo hoạt động mới ===");

    // Lấy domain từ request
    const domain = getDomainFromRequest(request);
    console.log("Domain hiện tại:", domain);

    const formData = await request.formData();
    let body = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });

    // Xử lý hình ảnh nếu có
    let imageUrl = null;
    const image = formData.get("image");
    if (image && image.name) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + "-" + image.name.replace(/\s/g, "_");
      const filepath = `public/uploads/${filename}`;
      fs.writeFileSync(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Tạo hoạt động mới
    const newActivity = new Activity({
      title: body.title,
      content: body.content,
      author: body.author,
      status: body.status,
      commentOption: body.commentOption,
      image: imageUrl,
      scheduledPublish: body.scheduledPublish,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newActivity.save();
    console.log("Đã lưu hoạt động mới:", newActivity._id);

    // Gửi thông báo nếu status là published
    if (body.status === "published") {
      try {
        console.log("=== Bắt đầu gửi thông báo ===");

        // Gửi thông báo cho người đăng ký email
        const subscribers = await NotificationSubscription.find({
          isActive: true,
          topics: "newPosts",
        }).lean();

        console.log(
          `Tìm thấy ${subscribers.length} người đăng ký nhận thông báo`
        );
        const logoUrl = `${domain}/Img/Homepage/Fulllogolight.png`;

        if (subscribers.length > 0) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            subject: `Hoạt động mới: ${newActivity.title} - Đoàn khoa MMT&TT`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <!-- Header với logo -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <img src="${logoUrl}" alt="Logo Đoàn khoa MMT&TT" style="max-width: 200px; height: auto;">
                </div>

                <!-- Tiêu đề -->
                <div style="background-color: #042354; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0; text-align: center;">Hoạt động mới từ Đoàn khoa MMT&TT</h2>
                </div>

                <!-- Nội dung chính -->
                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="color: #333; margin-top: 0;">${
                    newActivity.title
                  }</h3>
                  
                  <!-- Hình ảnh hoạt động nếu có -->
                  ${
                    newActivity.image
                      ? `
                    <div style="text-align: center; margin: 20px 0;">
                      <img src="${domain}${newActivity.image}" alt="${newActivity.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                    </div>
                  `
                      : ""
                  }

                  <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                    ${newActivity.content.substring(0, 600)}...
                  </div>

                  <!-- Nút xem chi tiết -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${domain}/Activities/${newActivity.slug}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #042354; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s;">
                      Xem chi tiết
                    </a>
                  </div>

                  <!-- Nút hủy đăng ký -->
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${domain}/Unsubscribe?email={{email}}" 
                       onclick="return confirm('Bạn có chắc chắn muốn hủy đăng ký nhận thông báo?');"
                       style="display: inline-block; padding: 8px 17px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s; font-size: 12px;">
                      Hủy đăng ký nhận thông báo
                    </a>
                  </div>

                  <!-- Thông tin về hủy đăng ký -->
                  <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 12px;">
                      <strong>Lưu ý:</strong> Nếu bạn không muốn nhận thông báo nữa, bạn có thể hủy đăng ký bằng cách nhấn vào nút "Hủy đăng ký nhận thông báo" ở trên.
                    </p>
                  </div>

                  <!-- Footer -->
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="font-size: 12px; color: #666; margin: 0;">
                      Đây là email tự động, vui lòng không trả lời email này.<br>
                      © 2025 Đoàn khoa Mạng máy tính và Truyền thông
                    </p>
                  </div>
                </div>
              </div>
            `,
          };

          console.log("=== Bắt đầu gửi email cho người đăng ký ===");
          let successCount = 0;
          let failCount = 0;

          // Gửi email cho từng người đăng ký
          for (const subscriber of subscribers) {
            console.log(`Đang gửi email đến ${subscriber.email}...`);
            const personalizedHtml = mailOptions.html.replace(
              "{{email}}",
              subscriber.email
            );
            const result = await sendEmailWithLogging({
              ...mailOptions,
              to: subscriber.email,
              html: personalizedHtml,
            });

            if (result.success) {
              successCount++;
              console.log(`✓ Đã gửi thành công đến ${subscriber.email}`);
            } else {
              failCount++;
              console.error(`✗ Gửi thất bại đến ${subscriber.email}`);
            }
          }

          console.log("=== Tổng kết gửi email ===");
          console.log(`Tổng số email: ${subscribers.length}`);
          console.log(`Thành công: ${successCount}`);
          console.log(`Thất bại: ${failCount}`);
          console.log("=========================");
        }

        console.log("Author from form:", body.author);

        let authorUser = null;
        if (ObjectId.isValid(body.author)) {
          authorUser = await User.findById(body.author).lean();
        } else {
          // Try to find by name, case insensitive
          authorUser = await User.findOne({
            name: { $regex: new RegExp(`^${body.author}$`, "i") },
          }).lean();
        }

        console.log("Author user found:", authorUser ? "Yes" : "No");

        const allUsers = await User.find().select("_id name role").lean();
        const adminUsers = allUsers.filter(
          (user) =>
            user.role === "admin" &&
            (!authorUser || user._id.toString() !== authorUser._id.toString())
        );
        const otherUsers = allUsers.filter(
          (user) =>
            (!authorUser ||
              user._id.toString() !== authorUser._id.toString()) &&
            user.role !== "admin"
        );

        // Tạo thông báo cho tác giả
        if (authorUser) {
          try {
            const token = generateUniqueToken(
              authorUser._id.toString(),
              newActivity.title
            );
            console.log("Generated token:", token); // Thêm log này
            await Notification.create({
              userId: authorUser._id.toString(),
              title: `Hoạt động mới đã được đăng tải: ${newActivity.title}`,
              message: `Hoạt động do bạn tạo đã được xuất bản thành công.`,
              read: false,
              link: `/Activities/${newActivity.slug}`,
              activityId: newActivity._id,
              type: "notification",
              token,
            });
            console.log("Đã tạo thông báo cho tác giả");
          } catch (err) {
            console.error("Lỗi khi tạo thông báo cho tác giả:", err.message);
          }
        }

        // Tạo thông báo cho admin
        let adminCreated = 0;
        for (const admin of adminUsers) {
          try {
            const token = generateUniqueToken(
              admin._id.toString(),
              newActivity.title
            );
            console.log("Generated token:", token); // Thêm log này
            await Notification.create({
              userId: admin._id.toString(),
              title: `[ADMIN] Hoạt động mới: ${newActivity.title}`,
              message: `Có hoạt động mới vừa được đăng tải: ${newActivity.title}`,
              read: false,
              link: `/Activities/${newActivity.slug}`,
              activityId: newActivity._id,
              type: "notification",
              token,
            });
            adminCreated++;
          } catch (err) {
            console.error(
              `Lỗi khi tạo thông báo cho admin ${admin.name}:`,
              err.message
            );
          }
        }
        console.log(`Đã tạo ${adminCreated} thông báo cho admin`);

        // Tạo thông báo cho người dùng thường
        let userCreated = 0;
        let userErrors = 0;
        const batchSize = 10;
        for (let i = 0; i < otherUsers.length; i += batchSize) {
          const batch = otherUsers.slice(i, i + batchSize);
          const createPromises = batch.map(async (user) => {
            try {
              const token = generateUniqueToken(
                user._id.toString(),
                newActivity.title
              );
              console.log("Generated token:", token); // Thêm log này
              await Notification.create({
                userId: user._id.toString(),
                title: `Hoạt động mới: ${newActivity.title}`,
                message: `Có hoạt động mới vừa được đăng tải: ${newActivity.title}`,
                read: false,
                link: `/Activities/${newActivity.slug}`,
                activityId: newActivity._id,
                type: "notification",
                token,
              });
              userCreated++;
            } catch (err) {
              userErrors++;
              console.error(
                `Lỗi khi tạo thông báo cho user ${user.name}:`,
                err.message
              );
            }
          });
          await Promise.allSettled(createPromises);
        }
        console.log(
          `Đã tạo ${userCreated} thông báo cho người dùng thường, ${userErrors} lỗi`
        );
        console.log(
          `Tổng cộng đã tạo ${1 + adminCreated + userCreated} thông báo`
        );
      } catch (notificationError) {
        console.error("=== Lỗi khi xử lý thông báo ===");
        console.error("Lỗi:", notificationError.message);
        console.error("Stack:", notificationError.stack);
        console.error("=========================");
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tạo hoạt động thành công",
        data: newActivity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== Lỗi khi tạo hoạt động ===");
    console.error("Lỗi:", error.message);
    console.error("Stack:", error.stack);
    console.error("=========================");

    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo hoạt động" },
      { status: 500 }
    );
  }
}

export async function SEARCH(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 8;

    const regex = new RegExp(q, "i");

    const activities = await Activity.find({
      status: "published",
      $or: [{ title: regex }, { content: regex }, { description: regex }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-comments")
      .lean();

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error searching activities:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tìm kiếm hoạt động" },
      { status: 500 }
    );
  }
}
