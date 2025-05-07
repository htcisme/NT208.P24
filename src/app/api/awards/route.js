import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Award from '@/models/Award';

// GET - Lấy danh sách giải thưởng
export async function GET(request) {
  try {
    await dbConnect();
    
    // Phân tích query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const year = searchParams.get("year");
    
    // Xây dựng query
    let query = {};
    
    // Lọc theo năm nếu có
    if (year) {
      query.year = year;
    }
    
    // Lấy tổng số giải thưởng
    const total = await Award.countDocuments(query);
    
    // Lấy danh sách giải thưởng theo trang
    const awards = await Award.find(query)
      .sort({ year: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      data: awards,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Thêm giải thưởng mới
export async function POST(request) {
  try {
    await dbConnect();
    
    // Parse request body
    const data = await request.json();
    
    // Tạo giải thưởng mới
    const newAward = new Award({
      organization: data.organization,
      content: data.content,
      year: data.year,
      date: data.date || new Date()
    });
    
    // Lưu vào database
    await newAward.save();
    
    return NextResponse.json({
      success: true,
      data: newAward
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating award:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}