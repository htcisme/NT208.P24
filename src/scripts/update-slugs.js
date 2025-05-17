// Script để cập nhật slug cho các bài viết cũ
async function updateSlugs() {
  try {
    const response = await fetch('/api/activities/update-slugs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(data.message);
      console.log(`Số bài viết đã cập nhật: ${data.updated}`);
    } else {
      console.error('Lỗi:', data.message);
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
  }
}

// Chạy script
updateSlugs(); 