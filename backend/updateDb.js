const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/zoo_management_db').then(async () => {
  const db = mongoose.connection.db;
  await db.collection('animals').updateMany({ species: 'Sư tử châu Phi (Panthera leo)' }, { '$set': { species: 'African Lion (Panthera leo)' } });
  await db.collection('animals').updateMany({ species: 'Vẹt đuôi dài xanh vàng (Ara ararauna)' }, { '$set': { species: 'Blue-and-yellow Macaw (Ara ararauna)' } });
  await db.collection('animals').updateMany({ species: 'Trăn gấm (Malayopython reticulatus)' }, { '$set': { species: 'Reticulated Python (Malayopython reticulatus)' } });
  await db.collection('areas').updateMany({ name: 'Khu vực Đồi Sư Tử' }, { '$set': { name: 'Lion Hill Zone' } });
  await db.collection('areas').updateMany({ name: 'Khu rừng nhiệt đới' }, { '$set': { name: 'Tropical Forest' } });
  await db.collection('areas').updateMany({ name: 'Thế giới bò sát' }, { '$set': { name: 'Reptile World' } });
  console.log('Updated to English');
  process.exit(0);
});
