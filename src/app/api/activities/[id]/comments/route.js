import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";

// GET - Lấy tất cả bình luận của một hoạt động
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const activity = await Activity.findById(id).select("comments").lean();

    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: activity.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy bình luận" },
      { status: 500 }
    );
  }
}

// POST - Thêm bình luận mới
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    // Validate dữ liệu
    if (!body.content || !body.author) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bình luận" },
        { status: 400 }
      );
    }

    const comment = {
      content: body.content,
      author: body.author,
      createdAt: new Date(),
      replyTo: body.replyTo || null,
    };

    // Thêm bình luận vào hoạt động
    const activity = await Activity.findById(id);
    
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Kiểm tra xem bài viết có cho phép bình luận không
    if (activity.commentOption === "closed") {
      return NextResponse.json(
        { success: false, message: "Bài viết này không cho phép bình luận" },
        { status: 403 }
      );
    }

    activity.comments.push(comment);
    await activity.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Thêm bình luận thành công", 
        data: activity.comments[activity.comments.length - 1] 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi thêm bình luận" },
      { status: 500 }
    );
  }
}