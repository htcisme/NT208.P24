import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { ObjectId } from "mongodb";

// Helper function to find activity by ID or slug
async function findActivityByIdOrSlug(slug) {
  if (ObjectId.isValid(slug)) {
    return await Activity.findById(slug);
  }
  return await Activity.findOne({ slug });
}

// GET - Lấy danh sách comments
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const activity = await findActivityByIdOrSlug(slug);
    
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // QUAN TRỌNG: Đảm bảo comments luôn là array
    const comments = Array.isArray(activity.comments) ? activity.comments : [];

    // Sắp xếp comments theo thời gian tạo (mới nhất trước)
    const sortedComments = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      data: sortedComments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách bình luận" },
      { status: 500 }
    );
  }
}

// POST - Thêm comment mới
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const { content, author, authorEmail, replyTo } = await request.json();

    // Validation
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nội dung bình luận không được để trống" },
        { status: 400 }
      );
    }

    if (!author || author.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Tên tác giả không được để trống" },
        { status: 400 }
      );
    }

    const activity = await findActivityByIdOrSlug(slug);
    
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Kiểm tra comment option
    if (activity.commentOption === "closed") {
      return NextResponse.json(
        { success: false, message: "Bình luận đã được đóng cho bài viết này" },
        { status: 403 }
      );
    }

    // Tạo comment mới với ID unique
    const newComment = {
      _id: new ObjectId(),
      content: content.trim(),
      author: author.trim(),
      authorEmail: authorEmail || null,
      replyTo: replyTo || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // QUAN TRỌNG: Đảm bảo comments là array trước khi push
    if (!Array.isArray(activity.comments)) {
      activity.comments = [];
    }

    // Thêm comment mới
    activity.comments.push(newComment);
    
    // Cập nhật timestamp của activity
    activity.updatedAt = new Date();
    
    await activity.save();

    return NextResponse.json({
      success: true,
      message: "Thêm bình luận thành công",
      data: newComment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi thêm bình luận" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa comment (optional - nếu cần)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID bình luận" },
        { status: 400 }
      );
    }

    const activity = await findActivityByIdOrSlug(slug);
    
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Đảm bảo comments là array
    if (!Array.isArray(activity.comments)) {
      activity.comments = [];
    }

    // Tìm và xóa comment
    const commentIndex = activity.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bình luận" },
        { status: 404 }
      );
    }

    activity.comments.splice(commentIndex, 1);
    activity.updatedAt = new Date();
    
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