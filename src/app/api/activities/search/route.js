import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';

function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit')) || 8;

    // Regex match rộng để lấy nhiều bản ghi hơn
    const regex = new RegExp(q, 'i');
    let activities = await Activity.find({
      status: 'published',
      $or: [
        { title: regex },
        { content: regex },
        { description: regex }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50) // lấy nhiều hơn để lọc lại phía dưới
      .select('-comments')
      .lean();

    // Lọc lại theo không dấu
    const qNoSign = removeVietnameseTones(q).toLowerCase();
    activities = activities.filter(act => {
      const title = removeVietnameseTones(act.title || '').toLowerCase();
      const content = removeVietnameseTones(act.content || '').toLowerCase();
      const description = removeVietnameseTones(act.description || '').toLowerCase();
      return (
        title.includes(qNoSign) ||
        content.includes(qNoSign) ||
        description.includes(qNoSign)
      );
    });

    // Trả về tối đa limit kết quả
    activities = activities.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error searching activities:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tìm kiếm hoạt động' },
      { status: 500 }
    );
  }
}
