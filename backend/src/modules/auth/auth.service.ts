import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Admin } from '../../models/Admin';
import { generateToken } from '../../utils/jwt';

export class AuthService {
  async login(identifier: string, password: string) {
    const admin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!admin) {
      throw { statusCode: 401, message: 'Invalid credentials. User not found.', isOperational: true };
    }

    if (!admin.isActive) {
      throw { statusCode: 403, message: 'Account has been deactivated. Please contact administrator.', isOperational: true };
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email/username or password.', isOperational: true };
    }

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    });

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async getProfile(adminId: number) {
    const admin = await Admin.findByPk(adminId, {
      attributes: ['id', 'email', 'username', 'name', 'role', 'isActive', 'lastLoginAt', 'createdAt'],
    });

    if (!admin) {
      throw { statusCode: 404, message: 'User not found.', isOperational: true };
    }

    return admin;
  }
}

export const authService = new AuthService();
