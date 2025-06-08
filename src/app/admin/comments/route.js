import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET(request) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const page = parseInt(url.searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({})
      .populate('activityId', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedComments = comments.map(comment => ({
      _id: comment._id,
      content: comment.content,
      author: comment.author,
      authorEmail: comment.authorEmail,
      createdAt: comment.createdAt,
      activitySlug: comment.activityId?.slug || comment.activitySlug || '',
      activityTitle: comment.activityId?.title || 'Không có tiêu đề',
    }));

    return NextResponse.json({
      success: true,
      data: formattedComments,
      total: await Comment.countDocuments(),
      page,
      limit
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy danh sách bình luận' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    
    const { commentId } = await request.json();
    
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    
    if (!deletedComment) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bình luận' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa bình luận thành công'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa bình luận' },
      { status: 500 }
    );
  }
}