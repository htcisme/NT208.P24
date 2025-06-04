# NT208.P24 - LẬP TRÌNH ỨNG DỤNG WEB

_**Lời ngỏ:**_Chào mừng quý thầy cô và các bạn đến với trang web đầu tiên của nhóm 4! Đây là sản phẩm mà cả nhóm đã cùng nhau lên ý tưởng, xây dựng và hoàn thiện với tất cả sự tâm huyết. Chúng mình hy vọng rằng trang web này sẽ mang lại những trải nghiệm hữu ích và thú vị cho mọi người._
_Dù đã cố gắng hết sức, nhưng chắc chắn không thể tránh khỏi những thiếu sót. Nhóm rất mong nhận được những góp ý chân thành từ quý thầy cô và các bạn để có thể cải thiện và phát triển sản phẩm ngày càng tốt hơn. Sự ủng hộ và đóng góp của mọi người chính là động lực lớn nhất để nhóm tiếp tục học hỏi và hoàn thiện hơn trong những dự án tiếp theo._
_Một lần nữa, nhóm 4 xin chân thành cảm ơn! ❤️_

---

## 📋 MỤC LỤC

1. [Thông tin đồ án](#i-thông-tin-đồ-án)
2. [Danh sách thành viên](#ii-danh-sách-thành-viên)
3. [Cấu trúc dự án](#iii-cấu-trúc-dự-án)
4. [Tính năng chính](#iv-tính-năng-chính)
5. [API và Database](#v-api-và-database)
6. [Công nghệ sử dụng](#vi-công-nghệ-sử-dụng)
7. [Hướng dẫn cài đặt](#vii-hướng-dẫn-cài-đặt)
8. [Các vấn đề và giải pháp](#viii-các-vấn-đề-và-giải-pháp)
9. [Kế hoạch phát triển](#ix-kế-hoạch-phát-triển)

---

## I. THÔNG TIN ĐỒ ÁN

**Tên đề tài:** Website Giới thiệu tổ chức Đoàn khoa Mạng máy tính và Truyền thông

**Mô tả:** Xây dựng website giới thiệu và quản lý hoạt động của Đoàn khoa MMT&TT, hỗ trợ sinh viên cập nhật thông tin, tham gia hoạt động và đặt phòng.

### 📊 Sơ đồ thiết kế hệ thống

_**1. Database Schema:**_
![Database image](public/Img/GitHub/Database_Web.png)

_**2. Login Activities Flow:**_
![Login Activities image](public/Img/GitHub/Login.png)

_**3. Use Case Diagram:**_
![Use Case Diagram image](public/Img/GitHub/Use_Case_Diagram.png)

---

## II. DANH SÁCH THÀNH VIÊN

| STT | Họ và tên | MSSV | Vai trò | Đóng góp chính |
|-----|-----------|------|---------|----------------|
| 1 | Hoàng Bảo Phước | 23521231 | Leader | Front End Development, Project Management |
| 2 | Nguyễn Đình Khang | 23520694 | Member | UI/UX Design, Frontend Development, Product Integration |
| 3 | Đỗ Quang Trung | 23521673 | Member | Backend Development, Quality Assurance, Testing |

---

## III. CẤU TRÚC DỰ ÁN

```
NT208.P24/
├── 📁 src/
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── 📁 Activities/               # Trang hoạt động
│   │   │   ├── 📁 [slug]/              # Chi tiết hoạt động [SLUG ROUTING]
│   │   │   │   └── page.jsx            # Activity detail page
│   │   │   ├── page.jsx                # Activities main page
│   │   │   └── activity-detail.css     # Styling cho detail page
│   │   │
│   │   ├── 📁 ActivitiesOverview/       # Tổng quan hoạt động
│   │   │   └── page.jsx
│   │   │
│   │   ├── 📁 api/                      # API Routes
│   │   │   ├── 📁 activities/          # Activities API
│   │   │   │   ├── 📁 [slug]/          # Dynamic route cho activity
│   │   │   │   │   ├── 📁 comments/    # Comments API cho activity
│   │   │   │   │   │   └── route.js    # GET, POST comments
│   │   │   │   │   └── route.js        # GET, PUT, DELETE activity
│   │   │   │   ├── route.js            # GET, POST activities
│   │   │   │   └── update-slugs/       # Utility để update slugs
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── 📁 auth/                # Authentication API
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── verify/
│   │   │   │
│   │   │   ├── 📁 booking/             # Booking API
│   │   │   └── 📁 users/               # User management API
│   │   │
│   │   ├── 📁 admin/                    # Admin Dashboard
│   │   │   ├── 📁 ActivitiesDashboard/ # Quản lý hoạt động
│   │   │   │   ├── page.jsx            # Main dashboard
│   │   │   │   └── style.css           # Dashboard styling
│   │   │   ├── 📁 UsersDashboard/      # Quản lý users
│   │   │   │   └── page.jsx
│   │   │   └── 📁 comments/            # Comments management API
│   │   │       ├── 📁 [commentId]/     # Individual comment actions
│   │   │       │   └── route.js        # PUT, DELETE comment
│   │   │       └── route.js            # GET, DELETE comments
│   │   │
│   │   ├── 📁 Booking/                  # Đặt phòng
│   │   │   └── page.jsx
│   │   │
│   │   ├── 📁 Introduction/             # Giới thiệu
│   │   │   └── page.jsx
│   │   │
│   │   ├── 📁 Profile/                  # Trang cá nhân
│   │   │   ├── page.jsx                # Profile management
│   │   │   ├── layout.jsx              # Profile layout
│   │   │   └── style.css               # Profile styling
│   │   │
│   │   ├── 📁 User/                     # Login/Register
│   │   │   └── page.jsx
│   │   │
│   │   ├── layout.js                   # Root layout
│   │   ├── page.js                     # Homepage
│   │   └── globals.css                 # Global styles
│   │
│   ├── 📁 components/                   # Reusable Components
│   │   ├── 📁 Comments/                # Comment system
│   │   │   ├── CommentSection.jsx      # Main comment component
│   │   │   ├── CommentList.jsx         # Display comments
│   │   │   ├── CommentForm.jsx         # Comment input form
│   │   │   └── style.css               # Comment styling
│   │   │
│   │   ├── 📁 Footer/                  # Footer component
│   │   ├── 📁 Header/                  # Header component
│   │   ├── 📁 HeaderAdmin/             # Admin header
│   │   └── 📁 NotificationBell/        # Notification system
│   │       └── index.jsx
│   │
│   ├── 📁 context/                      # React Context
│   │   └── SessionContext.jsx          # User session management
│   │
│   ├── 📁 lib/                          # Utilities
│   │   └── mongodb.js                  # Database connection
│   │
│   ├── 📁 models/                       # Database Models
│   │   ├── Activity.js                 # Activity schema & types
│   │   ├── User.js                     # User schema
│   │   ├── Notification.js             # Notification schema
│   │   └── Comment.js                  # Comment schema
│   │
│   └── 📁 styles-comp/                  # Component styles
│       └── style.css                   # Global component styles
│
├── 📁 public/                          # Static assets
│   └── 📁 Img/                         # Images
│       ├── 📁 Activities/              # Activity images
│       ├── 📁 GitHub/                  # Documentation images
│       └── 📁 [other-assets]/
│
├── 📄 README.md                        # Documentation
├── 📄 package.json                     # Dependencies
├── 📄 next.config.js                   # Next.js config
└── 📄 .env.local                       # Environment variables
```

### 🔑 Key Architecture Features

- **Dynamic Routing:** [`[slug]`](src/app/Activities/[slug]/page.jsx) cho activity details
- **API Routes:** RESTful API với Next.js App Router
- **Component Structure:** Modular components với reusable logic
- **Database Models:** MongoDB schemas với Mongoose
- **Context Management:** [`SessionContext`](src/context/SessionContext.jsx) cho user state

---

## IV. TÍNH NĂNG CHÍNH

### 🏠 Trang chủ ([`page.js`](src/app/page.js))
- [x] Hero banner với thông tin Đoàn khoa
- [x] Carousel hoạt động nổi bật
- [x] Thống kê và thành tích

### 📰 Hệ thống hoạt động
#### 📋 Danh sách hoạt động ([`Activities/page.jsx`](src/app/Activities/page.jsx))
- [x] Hiển thị hoạt động nổi bật với carousel
- [x] Sidebar tin tức mới nhất
- [x] Integration với API [`/api/activities`](src/app/api/activities/route.js)
- [x] Filtering và search functionality

#### 📖 Chi tiết hoạt động ([`Activities/[slug]/page.jsx`](src/app/Activities/[slug]/page.jsx))
- [x] Dynamic routing với slug parameter
- [x] Hiển thị full content với metadata
- [x] Activity type badges
- [x] Responsive image handling
- [x] Error handling và loading states

### 💬 Hệ thống bình luận ([`Comments/`](src/components/Comments/))
#### Core Features
- [x] **Nested comments:** Tree structure với replies
- [x] **Real-time updates:** Comment state management
- [x] **User authentication:** Login required để comment
- [x] **Admin controls:** Comment moderation

#### Implementation
- [`CommentSection.jsx`](src/components/Comments/CommentSection.jsx): Main wrapper
- [`CommentList.jsx`](src/components/Comments/CommentList.jsx): Display logic
- [`CommentForm.jsx`](src/components/Comments/CommentForm.jsx): Input handling
- API: [`/api/activities/[slug]/comments`](src/app/api/activities/[slug]/comments/route.js)

### 👤 User Management
#### Profile System ([`Profile/page.jsx`](src/app/Profile/page.jsx))
- [x] User profile management
- [x] Avatar upload with compression
- [x] Password change functionality
- [x] Form validation và error handling

#### Authentication ([`User/page.jsx`](src/app/User/page.jsx))
- [x] Login/Register forms
- [x] Role-based access (user/admin)
- [x] Session management với [`SessionContext`](src/context/SessionContext.jsx)

### 🛠️ Admin Dashboard ([`admin/ActivitiesDashboard/`](src/app/admin/ActivitiesDashboard/))
#### Activities Management
- [x] **CRUD operations:** Create, Read, Update, Delete activities
- [x] **Batch operations:** Multi-select actions
- [x] **Image upload:** File handling với preview
- [x] **Status management:** Draft/Published states
- [x] **Activity types:** 17 predefined types với badges

#### Comments Management  
- [x] **Real-time monitoring:** All comments across activities
- [x] **Moderation tools:** Edit, delete, batch actions
- [x] **Activity linking:** Navigate to source activity

### 🏢 Booking System ([`Booking/page.jsx`](src/app/Booking/page.jsx))
- [x] Multi-step form với validation
- [x] Room selection và time scheduling
- [x] Terms acceptance
- [ ] **TODO:** Calendar integration

### 🔔 Notification System ([`NotificationBell/`](src/components/NotificationBell/))
- [x] Real-time notifications
- [x] Mark as read functionality
- [x] Direct navigation to related content

---

## V. API VÀ DATABASE

### 🗃️ Database Models

#### Activity Schema ([`models/Activity.js`](src/models/Activity.js))
```javascript
{
  title: String,              // Tiêu đề
  slug: String,               // URL-friendly identifier
  content: String,            // Nội dung chính
  author: String,             // Tác giả
  type: String,               // Loại hoạt động (17 types)
  image: String,              // URL hình ảnh
  status: String,             // published/draft
  commentOption: String,      // open/closed
  comments: [{               // Embedded comments
    _id: ObjectId,
    content: String,
    author: String,
    authorEmail: String,
    replyTo: ObjectId,        // For nested replies
    createdAt: Date,
    updatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### User Schema ([`models/User.js`](src/models/User.js))
```javascript
{
  name: String,
  email: String,
  password: String,           // Hashed
  role: String,               // user/admin
  avatar: String,             // Base64 hoặc URL
  createdAt: Date,
  updatedAt: Date
}
```

### 🔌 API Endpoints

#### Activities API
| Method | Endpoint | File | Mô tả |
|--------|----------|------|-------|
| GET | `/api/activities` | [`route.js`](src/app/api/activities/route.js) | Lấy danh sách hoạt động |
| POST | `/api/activities` | [`route.js`](src/app/api/activities/route.js) | Tạo hoạt động mới |
| GET | `/api/activities/[slug]` | [`[slug]/route.js`](src/app/api/activities/[slug]/route.js) | Lấy chi tiết hoạt động |
| PUT | `/api/activities/[slug]` | [`[slug]/route.js`](src/app/api/activities/[slug]/route.js) | Cập nhật hoạt động |
| DELETE | `/api/activities/[slug]` | [`[slug]/route.js`](src/app/api/activities/[slug]/route.js) | Xóa hoạt động |

#### Comments API
| Method | Endpoint | File | Mô tả |
|--------|----------|------|-------|
| GET | `/api/activities/[slug]/comments` | [`comments/route.js`](src/app/api/activities/[slug]/comments/route.js) | Lấy comments của activity |
| POST | `/api/activities/[slug]/comments` | [`comments/route.js`](src/app/api/activities/[slug]/comments/route.js) | Thêm comment mới |

#### Admin API
| Method | Endpoint | File | Mô tả |
|--------|----------|------|-------|
| GET | `/api/admin/comments` | [`admin/comments/route.js`](src/app/admin/comments/route.js) | Lấy tất cả comments |
| DELETE | `/api/admin/comments` | [`admin/comments/route.js`](src/app/admin/comments/route.js) | Xóa comment |
| PUT | `/api/admin/comments/[commentId]` | [`[commentId]/route.js`](src/app/admin/comments/[commentId]/route.js) | Cập nhật comment |
| DELETE | `/api/admin/comments/[commentId]` | [`[commentId]/route.js`](src/app/admin/comments/[commentId]/route.js) | Xóa comment cụ thể |

---

## VI. CÔNG NGHỆ SỬ DỤNG

### 🛠️ Frontend Technologies
- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/JSX
- **Styling:** CSS3, CSS Modules
- **UI:** Custom components, responsive design
- **State Management:** React Hooks, Context API

### ⚙️ Backend Technologies
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** MongoDB với Mongoose ODM
- **Authentication:** JWT tokens
- **File Handling:** Base64 encoding cho images

### 📦 Key Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0"
}
```

---

## VII. HƯỚNG DẪN CÀI ĐẶT

### 📋 Yêu cầu hệ thống
- Node.js 18+
- MongoDB 5+
- Git

### 🚀 Cài đặt và chạy dự án

```bash
# Clone repository
git clone [repository-url]
cd NT208.P24

# Cài đặt dependencies
npm install

# Cấu hình environment variables
cp .env.example .env.local
# Cập nhật MONGODB_URI và JWT_SECRET

# Chạy development server
npm run dev

# Mở trình duyệt tại http://localhost:3000
```

### ⚙️ Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/nt208
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## VIII. CÁC VẤN ĐỀ VÀ GIẢI PHÁP

### 🐛 Issues đã được giải quyết

#### 1. **Dynamic Routing Problems**
**Vấn đề:** Activities detail page không load được với slug

**Giải pháp:** 
- Implement proper slug generation trong [`Activity model`](src/models/Activity.js)
- Use Next.js [`[slug]` routing](src/app/Activities/[slug]/page.jsx)
- Add slug update utility: [`update-slugs route`](src/app/api/activities/update-slugs/route.js)

#### 2. **Comment System Architecture**
**Vấn đề:** Nested comments và real-time updates

**Giải pháp:**
- Embedded comments trong Activity schema
- Tree structure organization trong [`CommentList.jsx`](src/components/Comments/CommentList.jsx)
- Proper state management với React hooks

#### 3. **Image Upload & Optimization**
**Vấn đề:** Large image files causing performance issues

**Giải pháp:**
- Base64 encoding với compression trong [`Profile/page.jsx`](src/app/Profile/page.jsx)
- Canvas-based image resizing
- File size validation (5MB limit)

#### 4. **Admin Dashboard Performance**
**Vấn đề:** Slow loading với large datasets

**Giải pháp:**
- Pagination trong [`admin comments API`](src/app/admin/comments/route.js)
- Batch operations trong [`ActivitiesDashboard`](src/app/admin/ActivitiesDashboard/page.jsx)
- Lazy loading và virtualization

### ⚠️ Known Limitations

#### 1. **Authentication System**
- **Issue:** Chưa có refresh token mechanism
- **Impact:** Users cần re-login thường xuyên
- **Workaround:** Extended JWT expiry time

#### 2. **File Storage**
- **Issue:** Images stored as Base64 trong database
- **Impact:** Database size tăng nhanh
- **Planned:** Migration to cloud storage (Cloudinary/AWS S3)

#### 3. **Real-time Features**
- **Issue:** Comments không update real-time
- **Impact:** Users cần refresh để thấy comments mới
- **Planned:** WebSocket integration

#### 4. **Mobile Responsiveness**
- **Issue:** Admin dashboard chưa fully responsive
- **Impact:** Difficult to use trên mobile devices
- **In Progress:** CSS media queries optimization

### 🔧 Technical Debt

#### 1. **Code Organization**
```javascript
// Current: Mixed logic trong components
// TODO: Extract business logic to custom hooks
// TODO: Implement proper error boundaries
```

#### 2. **Database Optimization**
```javascript
// Current: Embedded comments trong activities
// TODO: Separate comments collection với population
// TODO: Add database indexing cho better performance
```

#### 3. **API Error Handling**
```javascript
// Current: Basic try-catch
// TODO: Standardized error response format
// TODO: Proper HTTP status codes
```

### 📊 Performance Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Page Load Time | ~2.5s | <2s | 🟡 In Progress |
| Image Compression | 80% | 90% | ✅ Achieved |
| API Response Time | ~500ms | <300ms | 🟡 Optimizing |
| Mobile Score | 75/100 | 90/100 | 🔴 Needs Work |

---

## IX. KẾ HOẠCH PHÁT TRIỂN

### 📅 Phase 1 - Performance & Stability (Tuần 1-2)
- [ ] **Image Storage Migration**
  - Move từ Base64 sang cloud storage
  - Implement lazy loading cho images
  - Add WebP format support

- [ ] **Database Optimization**
  - Separate comments collection
  - Add proper indexing
  - Implement caching layer

- [ ] **Mobile Responsiveness**
  - Optimize admin dashboard cho mobile
  - Improve touch interactions
  - Better responsive breakpoints

### 📅 Phase 2 - New Features (Tuần 3-4)
- [ ] **Real-time Features**
  - WebSocket cho live comments
  - Real-time notifications
  - Live user status

- [ ] **Advanced Search**
  - Full-text search cho activities
  - Filter by multiple criteria
  - Search suggestions

- [ ] **Booking System Enhancement**
  - Calendar integration
  - Email confirmations
  - Booking history

### 📅 Phase 3 - Advanced Features (Tuần 5-6)
- [ ] **Analytics Dashboard**
  - User engagement metrics
  - Popular content tracking
  - Performance monitoring

- [ ] **Content Management**
  - Rich text editor
  - Media gallery
  - SEO optimization

- [ ] **Social Features**
  - User ratings/reviews
  - Social sharing
  - User activity feeds

### 🎯 Success Metrics
- Page load time < 2 seconds
- Mobile performance score > 90
- User engagement rate > 70%
- Zero critical bugs in production

---

## 🤝 ĐÓNG GÓP

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow coding standards
4. Write tests for new features
5. Commit changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open Pull Request

### Coding Standards
- Use ESLint configuration
- Follow Next.js best practices
- Write clear comments cho complex logic
- Implement proper error handling

---

## 📞 LIÊN HỆ

- **Email nhóm:** 235212312@gm.uit.edu.vn
- **Documentation:** [README.md](README.md)
- **Project Demo:** [Live Demo](nt208p24.vercel.app)

---

## 📄 GIẤY PHÉP

Dự án này được phát triển cho mục đích học tập tại Trường Đại học Công nghệ Thông tin, ĐHQG-HCM.

---

**© 2024 Nhóm 4 - NT208.P24. All rights reserved.**

*Last updated: December 2024*
