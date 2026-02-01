/**
 * Admin Seeder Script
 * 
 * Creates initial admin user for the system.
 * Run with: npm run seed:admin
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { StaffMember } from '../../modules/staff/staff.model.js';
import environment from '../../config/environment.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(`${environment.database.uri}/${environment.database.name}`);
    console.log('Connected to database');

    const existingAdmin = await StaffMember.findOne({ designation: 'ADMIN' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('admin123', 12);

    await StaffMember.create({
      fullName: 'System Administrator',
      badgeNumber: 'ADMIN001',
      designation: 'ADMIN',
      stationAssignment: 'Headquarters',
      passwordHash
    });

    console.log('✅ Admin user created successfully');
    console.log('Badge Number: ADMIN001');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
