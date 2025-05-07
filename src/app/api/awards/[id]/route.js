import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Award from "@/models/Award";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const award = await Award.findById(id).lean();
    
    if (!award) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy giải thưởng" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: award });
  } catch (error) {
    console.error("Error fetching award:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin giải thưởng" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật giải thưởng
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await request.json();
    
    const updatedAward = await Award.findByIdAndUpdate(
      id,
      {
        organization: data.organization,
        content: data.content,
        year: data.year,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedAward) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy giải thưởng" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedAward });
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Xóa giải thưởng
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const deletedAward = await Award.findByIdAndDelete(id);
    
    if (!deletedAward) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy giải thưởng" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Đã xóa giải thưởng thành công" 
    });
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}