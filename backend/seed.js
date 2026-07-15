require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

const ZooArea = require('./src/models/ZooArea');
const Animal = require('./src/models/Animal');
const ZooService = require('./src/models/ZooService');
const User = require('./src/models/User');

const demoUsers = [
  { email: 'user@zoo.com', password: '123456', fullName: 'Nguyen Van A', role: 'USER' },
  { email: 'staff@zoo.com', password: '123456', fullName: 'Tran Thi B', role: 'STAFF' },
  { email: 'staff2@zoo.com', password: '123456', fullName: 'Le Van C', role: 'STAFF' },
  { email: 'vet@zoo.com', password: '123456', fullName: 'Pham Thi D', role: 'VET' },
  { email: 'admin@zoo.com', password: '123456', fullName: 'Admin Zoo', role: 'ADMIN' },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear relevant collections
    await ZooArea.deleteMany({});
    await Animal.deleteMany({});
    await ZooService.deleteMany({});
    await User.deleteMany({});

    console.log('--- Bắt đầu khởi tạo dữ liệu mẫu (Seeding Database) ---');

    // Seed users
    const createdUsers = {};
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers[userData.email] = user;
    }
    console.log(`✅ Đã tạo thành công ${demoUsers.length} tài khoản Demo (Mật khẩu đều là: 123456)`);
    console.table(demoUsers.map(u => ({ Email: u.email, Role: u.role })));

    // 1. Khởi tạo dữ liệu mẫu cho Zoo Area
    const areas = await ZooArea.insertMany([
      {
        code: 'A01',
        name: 'Khu vực Đồi Sư Tử',
        description: 'Khu vực nuôi dưỡng sư tử châu Phi với mô phỏng thảo nguyên bán hoang mạc.',
        habitatType: 'Grassland',
        location: 'Phía Bắc sở thú',
        capacity: 10,
        status: 'Open',
      },
      {
        code: 'A02',
        name: 'Khu rừng nhiệt đới',
        description: 'Môi trường ẩm ướt dành cho các loài chim, bò sát và linh trưởng.',
        habitatType: 'Rainforest',
        location: 'Phía Đông sở thú',
        capacity: 25,
        status: 'Open',
      },
      {
        code: 'A03',
        name: 'Thế giới bò sát',
        description: 'Nhà kính điều hòa nhiệt độ nuôi dưỡng các loài bò sát quý hiếm.',
        habitatType: 'Indoor',
        location: 'Trung tâm hành chính',
        capacity: 15,
        status: 'Maintenance',
      },
    ]);
    console.log(`✅ Đã khởi tạo thành công ${areas.length} khu vực (Zoo Area).`);

    // 2. Khởi tạo dữ liệu mẫu cho Animal
    const animals = await Animal.insertMany([
      {
        code: 'AN001',
        name: 'Simba',
        species: 'Sư tử châu Phi (Panthera leo)',
        gender: 'Male',
        age: 5,
        healthStatus: 'Healthy',
        behavior: 'Active',
        origin: 'Nam Phi',
        area: areas[0]._id,
        status: 'Active',
      },
      {
        code: 'AN002',
        name: 'Bella',
        species: 'Vẹt đuôi dài xanh vàng (Ara ararauna)',
        gender: 'Female',
        age: 3,
        healthStatus: 'Healthy',
        behavior: 'Friendly',
        origin: 'Nam Mỹ',
        area: areas[1]._id,
        status: 'Active',
      },
      {
        code: 'AN003',
        name: 'Kaa',
        species: 'Trăn gấm (Malayopython reticulatus)',
        gender: 'Male',
        age: 4,
        healthStatus: 'Under Treatment',
        behavior: 'Lethargic',
        origin: 'Việt Nam',
        area: areas[2]._id,
        status: 'Active',
      },
    ]);
    console.log(`✅ Đã khởi tạo thành công ${animals.length} cá thể động vật (Animal).`);

    // 3. Khởi tạo dữ liệu mẫu cho Zoo Service
    const services = await ZooService.insertMany([
      {
        code: 'SV001',
        name: 'Chụp ảnh cùng động vật',
        category: 'Trải nghiệm',
        description: 'Dịch vụ chụp ảnh lưu niệm cùng các loài chim và bò sát thân thiện dưới sự giám sát của nhân viên.',
        price: 50000,
        duration: 15,
        isActive: true,
      },
      {
        code: 'SV002',
        name: 'Xe điện tham quan trọn gói',
        category: 'Di chuyển',
        description: 'Chuyến xe điện đưa khách tham quan vòng quanh toàn bộ khuôn viên sở thú kèm hướng dẫn viên thuyết minh.',
        price: 150000,
        duration: 45,
        isActive: true,
      },
      {
        code: 'SV003',
        name: 'Trải nghiệm cho thú ăn',
        category: 'Trải nghiệm',
        description: 'Khách tham quan tự tay đút thức ăn đã được chuẩn bị sẵn cho hươu cao cổ và voi.',
        price: 30000,
        duration: 20,
        isActive: false,
      },
    ]);
    console.log(`✅ Đã khởi tạo thành công ${services.length} dịch vụ sở thú (Zoo Service).`);
    console.log('--- Hoàn tất quá trình nạp dữ liệu mẫu ---');

    process.exit(0);
  } catch (error) {
    console.error('❌ Có lỗi xảy ra khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seedDatabase();
