import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BookingFormContent from "@/models/BookingFormContent";

const DOCUMENT_KEY = "main_booking_form";

// GET: Lấy nội dung form
export async function GET() {
  try {
    await dbConnect();
    let content = await BookingFormContent.findOne({ key: DOCUMENT_KEY });
    if (!content) {
      content = await new BookingFormContent().save();
    }
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật nội dung form
export async function PUT(request) {
  try {
    await dbConnect();
    const newData = await request.json();

    const updatedContent = await BookingFormContent.findOneAndUpdate(
      { key: DOCUMENT_KEY },
      { $set: newData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Cập nhật nội dung thành công",
      data: updatedContent,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật" },
      { status: 500 }
    );
  }
}
