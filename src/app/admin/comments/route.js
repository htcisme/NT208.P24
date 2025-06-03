import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";

// GET - Lấy tất cả bình luận cho admin quản lý
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const activitySlug = searchParams.get('activitySlug');
    
    const skip = (page - 1) * limit;

    // Tìm tất cả activities có comments
    let query = { 'comments.0': { $exists: true } };
    if (activitySlug) {
      query.slug = activitySlug;
    }

    const activities = await Activity.find(query).select('title slug comments author createdAt');
    
    // Flatten tất cả comments với thông tin activity
    let allComments = [];
    activities.forEach(activity => {
      activity.comments.forEach(comment => {
        allComments.push({
          _id: comment._id,
          content: comment.content,
          author: comment.author,
          authorEmail: comment.authorEmail,
          createdAt: comment.createdAt,
          replyTo: comment.replyTo,
          activityId: activity._id,
          activitySlug: activity.slug,
          activityTitle: activity.title,
          activityAuthor: activity.author
        });
      });
    });

    // Sắp xếp
    allComments.sort((a, b) => {
      if (sortOrder === 'desc') {
        return new Date(b[sortBy]) - new Date(a[sortBy]);
      }
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    });

    // Phân trang
    const paginatedComments = allComments.slice(skip, skip + limit);
    const total = allComments.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: paginatedComments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching comments for admin:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách bình luận" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa bình luận
export async function DELETE(request) {
  try {
    await dbConnect();
    
    const { commentId, activitySlug } = await request.json();
    
    if (!commentId || !activitySlug) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin commentId hoặc activitySlug" },
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