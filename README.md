
# Zoo Management System - Frontend

Đây là bộ khung dự án Frontend cơ bản dành cho team, được xây dựng bằng ReactJS (Create React App). Dự án đã được thiết lập sẵn Routing phân quyền (Role-based Routing), Layout cho từng Role và Trang đăng nhập demo.

## 🚀 Hướng dẫn cài đặt và chạy dự án

1. Mở terminal, di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện (nếu chưa cài):
   ```bash
   npm install
   ```
3. Khởi động dự án:
   ```bash
   npm start
   ```

Dự án sẽ tự động mở trên trình duyệt tại địa chỉ `http://localhost:3000`.

## 🔐 Tài khoản Demo (Đăng nhập)

Hệ thống đã có sẵn 4 tài khoản ứng với 4 vai trò để anh em test luồng chuyển trang. Khi đăng nhập thành công, hệ thống sẽ tự động chuyển hướng đến Dashboard tương ứng:

| Email             | Mật khẩu | Vai trò (Role)               | Chuyển hướng đến |
| :---------------- | :--------- | :---------------------------- | :-------------------- |
| `user@zoo.com`  | `123456` | **USER** (Khách)       | `/user`             |
| `staff@zoo.com` | `123456` | **STAFF** (Nhân viên) | `/staff`            |
| `vet@zoo.com`   | `123456` | **VET** (Thú y)        | `/vet`              |
| `admin@zoo.com` | `123456` | **ADMIN** (Quản lý)   | `/admin`            |

*(Lưu ý: Dữ liệu đăng nhập hiện đang lưu tạm ở `localStorage` để demo, chưa nối API thực)*

## 📁 Cấu trúc thư mục tham khảo

Anh em chú ý cấu trúc thư mục để code đúng file, dễ quản lý và hạn chế conflict:

```text
src/
├── components/    # Chứa các Component dùng chung (vd: Button, Table, PlaceholderPage)
├── context/       # Chứa các React Context (vd: AuthContext để quản lý user login)
├── layouts/       # Chứa các Layout bọc bên ngoài cho từng Role (Sidebar, Navbar)
├── pages/         # Chứa code giao diện chính, được chia theo phân quyền
│   ├── admin/     # Dành cho tính năng của Admin
│   ├── auth/      # Dành cho Login / Register
│   ├── staff/     # Dành cho tính năng của Staff
│   ├── user/      # Dành cho tính năng của Khách hàng
│   └── veterinary/# Dành cho tính năng của Bác sĩ thú y
├── routes/        # Cấu hình AppRoutes (điều hướng) & RoleRoute (bảo vệ quyền truy cập)
├── services/      # Nơi viết các hàm gọi API backend (axios/fetch)
└── utils/         # Các hàm tiện ích dùng chung
```

## 📝 Phân công module (Theo thư mục `pages/`)

- **Nguyên**: User & Ticket Booking (Khu vực Khách hàng & Đặt vé).
- **Mạnh**: Zoo Area, Animal & Service Management (Khu vực Sở thú, Động vật, Dịch vụ).
- **Duy**: Staff Task & Daily Care (Quản lý công việc Nhân viên & Chăm sóc thú hàng ngày).
- **Sơn**: Veterinary & Animal Health (Quản lý Thú y, Sổ y bạ & Sức khỏe động vật).
- **Ngọc**: Admin & Account Management (Khu vực Quản trị & Quản lý tài khoản).

## 💡 Lưu ý chung cho AE khi code

1. **Routing**: Các route chính đã được cấu hình trong `src/routes/AppRoutes.js`. Nếu anh em cần tạo trang mới (vd: Trang chi tiết động vật), hãy báo team và khai báo thêm vào file này bên dưới layout tương ứng của mình.
2. **Giao diện tạm**: Hiện tại các trang đang dùng `PlaceholderPage`. Anh em cứ tạo component mới thay thế vào file Dashboard của mình để phát triển giao diện thật.
3. **Màu sắc**: Màu chủ đạo của UI hiện tại là xanh lá cây rừng (`#1B5E3C`), nền trắng. Có thể bổ sung thêm CSS ở `src/index.css` hoặc dùng module CSS tùy ý.

Chúc AE code thuận lợi! 🚀.
