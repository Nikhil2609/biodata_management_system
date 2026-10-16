import request from 'supertest';
import { createApp } from '../app';
import { sequelize, Taluka, Gam, Admin, Biodata } from '../models';
import { calculateAge } from '../utils/ageCalculator';

const app = createApp();

describe('Marriage Biodata Management System - Test Suite', () => {
  let adminToken: string;
  let testTaluka: Taluka;
  let testGam: Gam;
  let enabledBiodataId: number;
  let disabledBiodataId: number;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync();

    // Ensure Taluka & Gam exist
    [testTaluka] = await Taluka.findOrCreate({
      where: { nameGu: 'પાલનપુર' },
      defaults: {
        nameGu: 'પાલનપુર',
        nameEn: 'Palanpur',
        district: 'Banaskantha',
        districtGu: 'બનાસકાંઠા',
        state: 'Gujarat',
        stateGu: 'ગુજરાત',
      },
    });

    [testGam] = await Gam.findOrCreate({
      where: { talukaId: testTaluka.id, nameGu: 'જગાણા' },
      defaults: {
        talukaId: testTaluka.id,
        nameGu: 'જગાણા',
        nameEn: 'Jagana',
      },
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // Unit Test 1: Age Calculator
  describe('Unit Tests: Age Calculator', () => {
    it('should accurately calculate age from date of birth', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 25;
      const dob = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(calculateAge(dob)).toBe(25);
    });
  });

  // Module 1: Authentication Tests
  describe('Module 1: Authentication & Authorization', () => {
    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'admin@biodata.com', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully with valid admin credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'admin@biodata.com', password: 'Admin@123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('admin@biodata.com');
      adminToken = res.body.data.token;
    });

    it('should reject unauthorized access to admin endpoints without token', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should allow authorized access to admin endpoints with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.counts).toBeDefined();
      expect(typeof res.body.data.counts.totalBiodata).toBe('number');
    });
  });

  // Module 5: Master Data Tests
  describe('Module 5: Gam & Taluka Master Data', () => {
    it('should return all Talukas including Palanpur and Vadgam', async () => {
      const res = await request(app).get('/api/v1/talukas');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(8);
      const palanpur = res.body.data.find((t: any) => t.nameGu === 'પાલનપુર');
      expect(palanpur).toBeDefined();
    });

    it('should filter Gams by Taluka ID (dependent dropdown)', async () => {
      const res = await request(app).get(`/api/v1/gams?talukaId=${testTaluka.id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      // All returned gams should belong to this taluka
      res.body.data.forEach((g: any) => {
        expect(g.talukaId).toBe(testTaluka.id);
      });
    });

    it('should search Gams by Gujarati name', async () => {
      const res = await request(app).get('/api/v1/gams?search=જગાણા');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const match = res.body.data.find((g: any) => g.nameGu === 'જગાણા');
      expect(match).toBeDefined();
    });
  });

  // Module 3 & 4: Biodata CRUD and Visibility Rules
  describe('Module 3 & 4: Biodata Management & Visibility Security', () => {
    it('should create a new enabled biodata via admin API', async () => {
      const newRecord = {
        gender: 'boy',
        fullName: 'Test Patel Ramesh',
        fullNameGu: 'ટેસ્ટ પટેલ રમેશ',
        birthDate: '1998-06-15',
        height: "5' 9\"",
        maritalStatus: 'unmarried',
        education: 'B.Tech IT',
        motherTongue: 'Gujarati',
        religion: 'Hindu',
        caste: 'Patidar Panchal',
        talukaId: testTaluka.id,
        gamId: testGam.id,
        district: 'Banaskantha',
        state: 'Gujarat',
        fatherName: 'Rameshbhai',
        fatherOccupation: 'Business',
        motherName: 'Kantaben',
        motherOccupation: 'Homemaker',
        occupationType: 'private_job',
        occupationTitle: 'Software Engineer',
        workLocation: 'Ahmedabad',
        contactPerson: 'Rameshbhai',
        contactNumber: '9898011223',
        status: 'enabled',
      };

      const res = await request(app)
        .post('/api/v1/admin/biodata')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newRecord);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('enabled');
      enabledBiodataId = res.body.data.id;
    });

    it('should create a disabled biodata via admin API', async () => {
      const disabledRecord = {
        gender: 'girl',
        fullName: 'Private Hidden Profile',
        fullNameGu: 'ખાનગી પ્રોફાઇલ',
        birthDate: '2000-01-01',
        height: "5' 4\"",
        maritalStatus: 'unmarried',
        education: 'B.Com',
        talukaId: testTaluka.id,
        gamId: testGam.id,
        fatherName: 'Father Name',
        fatherOccupation: 'Farmer',
        motherName: 'Mother Name',
        motherOccupation: 'Homemaker',
        occupationType: 'other',
        occupationTitle: 'Student',
        workLocation: 'Palanpur',
        contactPerson: 'Father',
        contactNumber: '9900011222',
        status: 'disabled',
      };

      const res = await request(app)
        .post('/api/v1/admin/biodata')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(disabledRecord);

      expect(res.status).toBe(201);
      disabledBiodataId = res.body.data.id;
    });

    it('SECURITY CHECK: Disabled biodata must NOT be accessible on public single detail API', async () => {
      const res = await request(app).get(`/api/v1/biodata/${disabledBiodataId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('SECURITY CHECK: Disabled biodata must NOT appear in public listing API', async () => {
      const res = await request(app).get('/api/v1/biodata');
      expect(res.status).toBe(200);
      const found = res.body.data.find((b: any) => b.id === disabledBiodataId);
      expect(found).toBeUndefined();
    });

    it('should allow visitor to search by Gujarati name', async () => {
      const res = await request(app).get('/api/v1/biodata?search=ટેસ્ટ');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].fullNameGu).toContain('ટેસ્ટ');
    });

    it('should filter public biodata by gender', async () => {
      const res = await request(app).get('/api/v1/biodata?gender=boy');
      expect(res.status).toBe(200);
      res.body.data.forEach((b: any) => {
        expect(b.gender).toBe('boy');
      });
    });

    it('should filter public biodata by age range', async () => {
      const res = await request(app).get('/api/v1/biodata?minAge=24&maxAge=30');
      expect(res.status).toBe(200);
      res.body.data.forEach((b: any) => {
        expect(b.age).toBeGreaterThanOrEqual(24);
        expect(b.age).toBeLessThanOrEqual(30);
      });
    });

    it('should toggle status from enabled to disabled via admin API', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/biodata/${enabledBiodataId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'disabled' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('disabled');

      // Now verify public cannot see it anymore
      const publicCheck = await request(app).get(`/api/v1/biodata/${enabledBiodataId}`);
      expect(publicCheck.status).toBe(404);
    });

    it('should reject creation with missing required fields (Yup validation)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/biodata')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ gender: 'boy' }); // Missing all other required fields

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });
});
