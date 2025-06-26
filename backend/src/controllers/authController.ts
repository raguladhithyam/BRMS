import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/User';
import redisClient from '../config/redis';

interface AuthRequest extends Request {
  user?: User;
}

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as Secret;
  return jwt.sign({ id }, secret, { expiresIn: '1d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, bloodGroup, rollNo, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      bloodGroup,
      rollNo,
      phone,
      availability: true,
    });

    // Generate token
    const token = generateToken(user.id);

    // Store session in Redis
    await redisClient.setEx(`session:${user.id}`, 7 * 24 * 60 * 60, token);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.id);

    // Store session in Redis
    await redisClient.setEx(`session:${user.id}`, 7 * 24 * 60 * 60, token);

    res.json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      // Remove session from Redis
      await redisClient.del(`session:${req.user.id}`);
    }

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, bloodGroup, rollNo } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
        return;
      }
    }

    // Update user
    const updatedUser = await req.user.update({
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      bloodGroup: bloodGroup || req.user.bloodGroup,
      rollNo: rollNo || req.user.rollNo,
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};