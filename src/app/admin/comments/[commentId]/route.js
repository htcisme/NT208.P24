import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";

// PUT - Cập nhật bình luận
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { commentId } = resolvedParams;
    const { content, activitySlug } = await request.json();

    if (!content || !activitySlug) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin cần thiết" },
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
    const comment = activity.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bình luận" },
        { status: 404 }
      );
    }

    comment.content = content;
    comment.updatedAt = new Date();
    
    await activity.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật bình luận thành công",
      data: comment
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật bình luận" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa bình luận cụ thể
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { commentId } = resolvedParams;
    const { activitySlug } = await request.json();

    if (!activitySlug) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin activitySlug" },
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

    // Xóa comment
    activity.comments = activity.comments.filter(
      comment => comment._id.toString() !== commentId
    );
    
    await activity.save();

    return NextResponse.json({
      success: true,
      message: "Xóa bình luận thành công"
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa bình luận" },
      { status: 500 }
    );
  }
}