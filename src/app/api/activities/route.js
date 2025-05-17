import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import fs from "fs";

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

    // Gửi thông báo nếu status là published
    if (body.status === "published") {
      try {
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
        console.error("Lỗi khi tạo thông báo:", notificationError);
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
    console.error("Error creating activity:", error);
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
