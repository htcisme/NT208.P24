import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import NotificationSubscription from "@/models/NotificationSubscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Lấy tất cả thông báo đăng ký của người dùng
export async function GET(request) {
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

    const subscriptions = await NotificationSubscription.find({
      userId,
    }).lean();
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error("Error fetching notification subscriptions:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin đăng ký" },
      { status: 500 }
    );
  }
}

// POST - Đăng ký nhận thông báo mới
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Lấy userId từ body hoặc từ session
    let userId = body.userId;

    // Nếu không có userId trong body, thử lấy từ session
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (session && session.user) {
        userId = session.user.id;
      }
    }

    // Validate dữ liệu
    if (!userId || !body.token) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu thông tin đăng ký (userId hoặc token)",
        },
        { status: 400 }
      );
    }

    // Tạo hoặc cập nhật đăng ký
    const subscription = await NotificationSubscription.findOneAndUpdate(
      { userId: userId },
      {
        userId: userId,
        token: body.token,
        isActive: true,
        topics: body.topics || ["newPosts"],
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký nhận thông báo thành công",
        data: subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi đăng ký thông báo" },
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
