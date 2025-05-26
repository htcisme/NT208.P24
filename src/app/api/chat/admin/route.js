import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import mongoose from "mongoose";

// GET - Lấy danh sách user có tin nhắn
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "adminId là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Kiểm tra admin có tồn tại và có quyền admin không
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn không có quyền thực hiện thao tác này",
        },
        { status: 403 }
      );
    }

    // Lấy danh sách người gửi tin nhắn (loại trừ tin nhắn bot và tin cho bot)
    const distinctSenders = await Chat.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                // Tin nhắn gửi đến admin hoặc các admin khác
                { receiver: "admin" },
                // Tin nhắn admin gửi đi cho users
                {
                  sender: {
                    $in: await User.find({ role: "admin" })
                      .distinct("_id")
                      .then((ids) => ids.map((id) => id.toString())),
                  },
                },
              ],
            },
            { isBot: { $ne: true } }, // Loại trừ tin nhắn bot
          ],
        },
      },
      {
        $group: {
          _id: {
            // Nhóm theo ID người gửi nếu receiver là admin,
            // hoặc theo ID người nhận nếu sender là admin
            userId: {
              $cond: {
                if: { $eq: ["$receiver", "admin"] },
                then: "$sender",
                else: "$receiver",
              },
            },
          },
          latestMessage: { $max: "$createdAt" },
          name: {
            $first: {
              $cond: {
                if: { $eq: ["$receiver", "admin"] },
                then: "$senderName",
                else: "$receiverName",
              },
            },
          },
        },
      },
      {
        $match: {
          "_id.userId": { $ne: admin._id.toString() }, // Loại bỏ chính admin đang đăng nhập
        },
      },
      {
        $sort: { latestMessage: -1 },
      },
    ]);

    // Kiểm tra tin nhắn chưa đọc cho mỗi người gửi
    const usersWithUnread = await Promise.all(
      distinctSenders.map(async (sender) => {
        const unreadCount = await Chat.countDocuments({
          sender: sender._id.userId,
          receiver: "admin",
          isRead: false,
          isBot: false, // Không đếm tin nhắn từ bot
        });

        return {
          userId: sender._id.userId, // Extract the actual userId string from the _id object
          name: sender.name,
          lastActive: sender.latestMessage,
          unreadCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithUnread,
    });
  } catch (error) {
    console.error("Error fetching chat users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi lấy danh sách người dùng",
      },
      { status: 500 }
    );
  }
}

// POST - Admin gửi tin nhắn cho người dùng
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    let { adminId, userId, content } = body;

    if (!adminId || !userId || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "adminId, userId và content là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Kiểm tra và xử lý nếu userId là object
    if (typeof userId === "object" && userId.userId) {
      userId = userId.userId;
    }

    // Kiểm tra xem userId có phải là một MongoDB ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "UserId không hợp lệ",
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem adminId có phải là một MongoDB ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return NextResponse.json(
        {
          success: false,
          message: "AdminId không hợp lệ",
        },
        { status: 400 }
      );
    }

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn không có quyền thực hiện thao tác này",
        },
        { status: 403 }
      );
    }

    // Lấy thông tin người nhận
    const receiver = await User.findById(userId);
    if (!receiver) {
      return NextResponse.json(
        {
          success: false,
          message: "Người nhận không tồn tại",
        },
        { status: 404 }
      );
    }

    // Tạo tin nhắn mới từ admin cho user
    const newMessage = new Chat({
      sender: adminId,
      senderName: admin.name,
      receiver: userId,
      receiverName: receiver.name,
      content,
      isAdmin: true, // Đánh dấu đây là tin nhắn từ admin
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: "Gửi tin nhắn thành công",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending admin message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi gửi tin nhắn",
      },
      { status: 500 }
    );
  }
}
