require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const demoUsers = [
  { email: 'user@zoo.com', password: '123456', role: 'USER' },
  { email: 'staff@zoo.com', password: '123456', role: 'STAFF' },
  { email: 'vet@zoo.com', password: '123456', role: 'VET' },
  { email: 'admin@zoo.com', password: '123456', role: 'ADMIN' },
];

const seedDatabase = async () => {
  try {
    // Kết nối database
    await connectDB();

    // Xóa hết User cũ để tránh trùng lặp
    await User.deleteMany();
    console.log('✅ Đã xoá toàn bộ User cũ.');

    // Vì pre('save') middleware trên User model mới mã hoá password (bcrypt), 
    // insertMany KHÔNG tự chạy middleware này.
    // Nên ta phải dùng .save() cho từng user để password được mã hoá đúng cách.
    for (const u of demoUsers) {
      const user = new User(u);
      await user.save();
    }
    
    console.log('✅ Đã tạo thành công 4 tài khoản Demo (Mật khẩu đều là: 123456):');
    console.table(demoUsers.map(u => ({ Email: u.email, Role: u.role })));

    process.exit();
  } catch (error) {
    console.error('❌ Lỗi tạo dữ liệu mẫu:', error);
    process.exit(1);
  }
};

seedDatabase();
