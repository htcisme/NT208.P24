
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import upload from '@/lib/multer';

// GET - Lấy danh sách hoạt động
export async function GET(request) {
  try {
    await dbConnect();
    
    // Phân tích query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 8;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    // Xây dựng query
    let query = {};
    
    // Nếu có parameter status, lọc theo status
    if (status) {
      query.status = status;
    } else {
      // Mặc định chỉ lấy các bài đã xuất bản nếu không chỉ định status
      query.status = "published";
    }

    // Tìm các bài viết theo query
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian giảm dần (mới nhất lên đầu)
      .skip(skip)
      .limit(limit)
      .select("-comments") // Không lấy comments để giảm kích thước dữ liệu
      .lean();

    // Đếm tổng số bài viết thỏa mãn query
    const total = await Activity.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách hoạt động" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    // Xử lý request với multer
    const formData = await request.formData();
    let body = {};
    
    // Chuyển formData sang đối tượng
    formData.forEach((value, key) => {
      body[key] = value;
    });
    
    // Lưu file nếu có
    let imageUrl = null;
    const image = formData.get('image');
    
    if (image) {
      // Lưu file vào thư mục uploads
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + '-' + image.name.replace(/\s/g, '_');
      const filepath = `public/uploads/${filename}`;
      
      require('fs').writeFileSync(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }
    
    // Tạo hoạt động mới với hình ảnh
    const newActivity = new Activity({
      title: body.title,
      content: body.content,
      author: body.author,
      status: body.status,
      commentOption: body.commentOption,
      image: imageUrl,
      scheduledPublish: body.scheduledPublish,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await newActivity.save();
    
    return NextResponse.json({
      success: true,
      message: 'Tạo hoạt động thành công',
      data: newActivity,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tạo hoạt động' },
      { status: 500 }
    );
  }
}