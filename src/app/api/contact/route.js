import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

const CONTACT_DOCUMENT_KEY = "main_contact";

// Hàm để lấy hoặc tạo dữ liệu liên hệ mặc định
async function getOrCreateContactData() {
  let contactData = await Contact.findOne({ key: CONTACT_DOCUMENT_KEY });

  if (!contactData) {
    console.log(
      "Không tìm thấy thông tin liên hệ, đang tạo dữ liệu mặc định..."
    );
    const defaultData = {
      key: CONTACT_DOCUMENT_KEY,
      address:
        "Sảnh Tầng 8, Tòa nhà E, Trường Đại học Công nghệ Thông tin - ĐHQG - HCM\nKhu phố 6, phường Linh Trung, quận Thủ Đức, TP. Hồ Chí Minh",
      email: "doanthanhnien@suctremmt.com",
      phone: "0123 456 789",
      facebookUrl: "https://www.facebook.com/uit.nc",
      mapUrl: `https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+Th%C3%B4ng+tin+-+%C4%90HQG+TP.HCM/@10.8700089,106.8004793,17z/data=!3m1!4b1!4m6!3m5!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!8m2!3d10.8700089!4d106.8030542!16s%2Fm%2F02qqlmm?entry=ttu`,
    };
    contactData = await new Contact(defaultData).save();
  }
  return contactData;
}

// GET: Lấy thông tin liên hệ
export async function GET() {
  try {
    await dbConnect();
    const contactData = await getOrCreateContactData();
    return NextResponse.json({ contact: contactData });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu liên hệ từ MongoDB:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ khi lấy dữ liệu" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật thông tin liên hệ
export async function PUT(request) {
  try {
    await dbConnect();
    const newData = await request.json();

    if (!newData || typeof newData !== "object") {
      return NextResponse.json(
        { message: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    // Không cho phép cập nhật 'key'
    delete newData.key;

    const updatedContact = await Contact.findOneAndUpdate(
      { key: CONTACT_DOCUMENT_KEY },
      { $set: newData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      message: "Cập nhật thông tin thành công",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu liên hệ vào MongoDB:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ khi cập nhật dữ liệu" },
      { status: 500 }
    );
  }
}
