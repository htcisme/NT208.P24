import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

// PUT - Cập nhật bình luận
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { commentId } = params;
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return Response.json(
        { success: false, message: 'Nội dung bình luận không được để trống' },
        { status: 400 }
      );
    }

    // Cập nhật bình luận
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { 
        content: content.trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedComment) {
      return Response.json(
        { success: false, message: 'Không tìm thấy bình luận' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Cập nhật bình luận thành công',
      data: updatedComment
    });

  } catch (error) {
    console.error('Error updating comment:', error);
    return Response.json(
      { success: false, message: 'Lỗi khi cập nhật bình luận' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa bình luận cụ thể
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { commentId } = params;

    // Xóa bình luận
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    
    if (!deletedComment) {
      return Response.json(
        { success: false, message: 'Không tìm thấy bình luận' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Xóa bình luận thành công'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return Response.json(
      { success: false, message: 'Lỗi khi xóa bình luận' },
      { status: 500 }
    );
  }
}