import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Lấy tất cả activities có comments
    const activities = await Activity.find(
      { "comments.0": { $exists: true } },
      { title: 1, slug: 1, comments: 1, createdAt: 1 }
    ).limit(limit).skip(skip);

    // Flatten comments từ tất cả activities
    const allComments = [];
    activities.forEach(activity => {
      activity.comments.forEach(comment => {
        allComments.push({
          _id: comment._id,
          content: comment.content,
          author: comment.author,
          authorEmail: comment.authorEmail,
          createdAt: comment.createdAt,
          activitySlug: activity.slug,
          activityTitle: activity.title
        });
      });
    });

    // Sắp xếp theo thời gian mới nhất
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      data: allComments,
      total: allComments.length
    });

  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy dữ liệu bình luận" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    
    const { commentId, activitySlug } = await request.json();

    const activity = await Activity.findOne({ slug: activitySlug });
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Xóa comment khỏi activity
    activity.comments = activity.comments.filter(
      comment => comment._id.toString() !== commentId
    );

    await activity.save();

    return NextResponse.json({
      success: true,
      message: "Đã xóa bình luận thành công"
    });

  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa bình luận" },
      { status: 500 }
    );
  }
}

// POST endpoint để reply comment - CHỈ ĐỊNH NGHĨA MỘT LẦN
export async function POST(request) {
  try {
    await dbConnect();
    
    const { commentId, activitySlug, content, author, authorEmail } = await request.json();

    // Validation chi tiết hơn
    if (!commentId) {
      return NextResponse.json(
        { success: false, message: "commentId là bắt buộc" },
        { status: 400 }
      );
    }

    if (!activitySlug) {
      return NextResponse.json(
        { success: false, message: "activitySlug là bắt buộc" },
        { status: 400 }
      );
    }

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nội dung reply không được để trống" },
        { status: 400 }
      );
    }

    if (!author || author.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Tên tác giả không được để trống" },
        { status: 400 }
      );
    }

    console.log("Received data:", { commentId, activitySlug, content, author, authorEmail });

    // Tìm activity
    const activity = await Activity.findOne({ slug: activitySlug });
    if (!activity) {
      console.error("Activity not found:", activitySlug);
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    console.log("Found activity:", activity.title);

    // Tạo reply comment mới với ObjectId hợp lệ
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      content: content.trim(),
      author: author.trim(),
      authorEmail: authorEmail || null,
      replyTo: commentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Creating new reply:", newReply);

    // Đảm bảo comments là array
    if (!Array.isArray(activity.comments)) {
      activity.comments = [];
    }

    // Thêm reply vào comments
    activity.comments.push(newReply);
    activity.updatedAt = new Date();
    
    // Lưu activity
    const savedActivity = await activity.save();
    console.log("Activity saved successfully");

    return NextResponse.json({
      success: true,
      message: "Đã thêm reply thành công",
      data: newReply
    });

  } catch (error) {
    console.error("=== Error in POST /api/admin/comments ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("==========================================");
    
    return NextResponse.json(
      { success: false, message: `Lỗi khi thêm reply: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT endpoint để update comment
export async function PUT(request) {
  try {
    await dbConnect();
    
    const { commentId, activitySlug, content } = await request.json();

    // Validation
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nội dung không được để trống" },
        { status: 400 }
      );
    }

    const activity = await Activity.findOne({ slug: activitySlug });
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Tìm và cập nhật comment
    const commentIndex = activity.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bình luận" },
        { status: 404 }
      );
    }

    // Cập nhật content và updatedAt
    activity.comments[commentIndex].content = content.trim();
    activity.comments[commentIndex].updatedAt = new Date();
    activity.updatedAt = new Date();
    
    await activity.save();

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật bình luận thành công",
      data: activity.comments[commentIndex]
    });

  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật bình luận" },
      { status: 500 }
    );
  }
}