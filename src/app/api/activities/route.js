import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Category from "@/models/Category";
import Notification from "@/models/Notification";
import User from "@/models/User";
import NotificationSubscription from "@/models/NotificationSubscription";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import fs from "fs";
import nodemailer from "nodemailer";
import { ImageProcessor } from "@/lib/imageUtils";

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
    const limit = parseInt(searchParams.get("limit")) || 4;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const types = searchParams.get("types");
    const skip = (page - 1) * limit;

    const query = { status: "published" };
    if (type) {
      query.type = type;
    }
    // Add type filter
    if (type) {
      query.type = type;
    } else if (types) {
      // Multiple types filter
      const typeArray = types.split(",");
      query.type = { $in: typeArray };
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách hoạt động" },
      { status: 500 }
    );
  }
}

function processImages(imagesData) {
  if (!imagesData) return [];

  try {
    const parsedImages = JSON.parse(imagesData);
    if (!Array.isArray(parsedImages)) return [];

    return parsedImages
      .map((img) => {
        // Nếu là object có type: 'url' thì cần convert
        if (img && img.type === "url" && img.data) {
          // Sẽ được convert thành base64 trong POST handler
          return { type: "url", url: img.data };
        }
        // Nếu là base64 object
        else if (img && img.data && img.contentType) {
          return {
            data: img.data,
            contentType: img.contentType,
            filename: img.filename || "uploaded-image",
            size: img.size || 0,
          };
        }
        // Nếu là URL string (legacy)
        else if (typeof img === "string") {
          return { type: "url", url: img };
        }
        return null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error processing images:", error);
    return [];
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const slug = request.url.split("/").pop();
    const formData = await request.formData();

    console.log("Updating activity with slug:", slug);

    // Xử lý images (cả URL và base64)
    const processedImages = processImages(formData.get("images"));

    // Validate type
    const type = formData.get("type");
    const category = await Category.findOne({ value: type });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Type không hợp lệ" },
        { status: 400 }
      );
    }

    const updateData = {
      title: formData.get("title"),
      content: formData.get("content"),
      status: formData.get("status"),
      commentOption: formData.get("commentOption"),
      type: formData.get("type"),
      images: processedImages, // Cập nhật với images mới
      updatedAt: new Date(),
    };

    console.log("Update data:", {
      ...updateData,
      images: `Array of ${processedImages.length} images`,
    });

    const activity = await Activity.findOneAndUpdate(
      { slug: slug },
      { $set: updateData },
      { new: true }
    );

    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật thành công",
      data: activity.toObject(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật bài viết" },
      { status: 500 }
    );
  }
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (await Activity.findOne({ slug })) {
    // Expand slug with a counter if it already exists
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
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

    // slug gen
    const baseSlug =
      body.title
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "") || `activity-${Date.now()}`;

    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // =============================
    // 🔹 Xử lý hình ảnh thành base64
    // =============================
    let processedImages = [];
    const imagesJson = formData.get("images");
    if (imagesJson) {
      try {
        const parsedImages = JSON.parse(imagesJson);
        console.log("Parsed images:", parsedImages);

        // Validate và xử lý từng ảnh
        for (const img of parsedImages) {
          if (img && img.data && img.contentType) {
            // Validate base64 data
            if (
              !img.data.startsWith("data:") &&
              !img.data.includes(";base64,")
            ) {
              processedImages.push({
                data: img.data,
                contentType: img.contentType,
                filename: img.filename || "image",
                size: img.size || 0,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error parsing images:", error);
      }
    }
    console.log("=== Images Debug ===");
    console.log("Processed images count:", processedImages.length);
    console.log("====================");

    // Check type/category
    const type = formData.get("type");
    const category = await Category.findOne({ value: type });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Type không hợp lệ" },
        { status: 400 }
      );
    }

    // =============================
    // 🔹 Tạo activity mới
    // =============================
    const newActivity = new Activity({
      title: body.title,
      content: body.content,
      author: body.author,
      status: body.status,
      commentOption: body.commentOption,
      type: type || "other",
      images: processedImages, // 🔹 Lưu base64 images thay vì URL
      scheduledPublish: body.scheduledPublish,
      slug: uniqueSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newActivity.save();
    console.log("Đã lưu hoạt động mới:", newActivity._id);

    // =============================
    // 🔹 Gửi email + notifications
    // =============================
    if (body.status === "published") {
      try {
        console.log("=== Bắt đầu gửi thông báo ===");

        // Subscribers nhận email
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
              <div style="font-family: Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px; background-color:#f8f9fa;">
                <div style="text-align:center; margin-bottom:30px;">
                  <img src="${logoUrl}" alt="Logo" style="max-width:200px; height:auto;">
                </div>
                <div style="background:#042354; color:white; padding:20px; border-radius:8px; margin-bottom:20px;">
                  <h2 style="margin:0; text-align:center;">Hoạt động mới từ Đoàn khoa MMT&TT</h2>
                </div>
                <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="color:#333; margin-top:0;">${
                    newActivity.title
                  }</h3>
                  ${
                    newActivity.images && newActivity.images.length > 0
                      ? `<div style="text-align:center; margin:20px 0;">
                          <img src="data:${newActivity.images[0].contentType};base64,${newActivity.images[0].data}" 
                               alt="${newActivity.title}" 
                               style="max-width:100%; height:auto; border-radius:8px;">
                         </div>`
                      : ""
                  }
                  <div style="margin:20px 0; padding:15px; background:#f5f5f5; border-radius:5px;">
                    ${newActivity.content.substring(0, 600)}...
                  </div>
                  <div style="text-align:center; margin:30px 0;">
                    <a href="${domain}/Activities/${newActivity.slug}" 
                       style="display:inline-block; padding:12px 24px; background:#042354; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">
                      Xem chi tiết
                    </a>
                  </div>
                  <div style="text-align:center; margin:20px 0;">
                    <a href="${domain}/Unsubscribe?email={{email}}" 
                       style="display:inline-block; padding:8px 17px; background:#dc3545; color:white; text-decoration:none; border-radius:5px; font-size:12px;">
                      Hủy đăng ký
                    </a>
                  </div>
                  <div style="background:#fff3cd; border:1px solid #ffeeba; color:#856404; padding:15px; border-radius:5px; margin:20px 0;">
                    <p style="margin:0; font-size:12px;">
                      Nếu không muốn nhận thông báo nữa, bạn có thể hủy đăng ký.
                    </p>
                  </div>
                  <div style="margin-top:30px; padding-top:20px; border-top:1px solid #eee; text-align:center;">
                    <p style="font-size:12px; color:#666; margin:0;">
                      Đây là email tự động, vui lòng không trả lời.<br>
                      © 2025 Đoàn khoa MMT&TT
                    </p>
                  </div>
                </div>
              </div>
            `,
          };

          let successCount = 0;
          let failCount = 0;

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

        // =============================
        // 🔹 Notifications (author, admin, users)
        // =============================
        console.log("Author from form:", body.author);

        let authorUser = null;
        if (ObjectId.isValid(body.author)) {
          authorUser = await User.findById(body.author).lean();
        } else {
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

        // Notification cho tác giả
        if (authorUser) {
          try {
            const token = generateUniqueToken(
              authorUser._id.toString(),
              newActivity.title
            );
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

        // Notification cho admin
        let adminCreated = 0;
        for (const admin of adminUsers) {
          try {
            const token = generateUniqueToken(
              admin._id.toString(),
              newActivity.title
            );
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

        // Notification cho user thường
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
        console.error(notificationError.stack);
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
    console.error(error.stack);

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
