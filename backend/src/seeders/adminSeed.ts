import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin';

export const seedAdmin = async () => {
  const existingAdmin = await Admin.findOne({ where: { email: 'admin@biodata.com' } });
  if (existingAdmin) {
    console.log('ℹ️ Admin user already exists.');
    return existingAdmin;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('Admin@123', saltRounds);

  const admin = await Admin.create({
    email: 'admin@biodata.com',
    username: 'admin',
    passwordHash,
    name: 'મુખ્ય એડમિનિસ્ટ્રેટર (Admin)',
    role: 'superadmin',
    isActive: true,
  });

  console.log('✅ Admin user created: admin@biodata.com / Admin@123');
  return admin;
};
