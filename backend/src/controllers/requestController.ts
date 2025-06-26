import { Request, Response } from 'express';
import { BloodRequest, User, StudentOptIn } from '../models/associations';
import { emitToAdmins, emitToStudents } from '../config/socket';
import { createNotification } from '../services/notificationService';
import { sendEmail } from '../services/emailService';
import { Op } from 'sequelize';

interface AuthRequest extends Request {
  user?: User;
}

export const createBloodRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestData = req.body;

    // Create blood request
    const bloodRequest = await BloodRequest.create(requestData);

    // Get Socket.IO instance
    const io = req.app.get('io');

    // Notify all admins
    emitToAdmins(io, 'request_created', {
      message: `New blood request: ${bloodRequest.bloodGroup} needed`,
      bloodGroup: bloodRequest.bloodGroup,
      urgency: bloodRequest.urgency,
      requestId: bloodRequest.id,
    });

    // Create notifications for all admins
    const admins = await User.findAll({ where: { role: 'admin' } });
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: 'request_created',
        title: 'New Blood Request',
        message: `${bloodRequest.requestorName} needs ${bloodRequest.bloodGroup} blood (${bloodRequest.units} units)`,
        metadata: { requestId: bloodRequest.id },
      });
    }

    // Send email to admins
    const adminEmails = admins.map(admin => admin.email);
    await sendEmail({
      to: adminEmails,
      subject: `New Blood Request - ${bloodRequest.bloodGroup} Needed`,
      template: 'newBloodRequest',
      data: {
        requestorName: bloodRequest.requestorName,
        bloodGroup: bloodRequest.bloodGroup,
        units: bloodRequest.units,
        urgency: bloodRequest.urgency,
        hospitalName: bloodRequest.hospitalName,
        location: bloodRequest.location,
        dateTime: bloodRequest.dateTime,
      },
    });

    res.status(201).json({
      success: true,
      data: bloodRequest,
      message: 'Blood request submitted successfully',
    });
  } catch (error) {
    console.error('Create blood request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getMatchingRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Get approved requests matching user's blood group
    const matchingRequests = await BloodRequest.findAll({
      where: {
        bloodGroup: req.user.bloodGroup,
        status: 'approved',
        dateTime: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: StudentOptIn,
          as: 'optedInStudents',
          include: [
            {
              model: User,
              as: 'student',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      order: [['urgency', 'DESC'], ['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: matchingRequests,
    });
  } catch (error) {
    console.error('Get matching requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const optInToRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: requestId } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Check if user is available
    if (!req.user.availability) {
      res.status(400).json({
        success: false,
        message: 'You are currently marked as unavailable',
      });
      return;
    }

    // Check if request exists and is approved
    const bloodRequest = await BloodRequest.findOne({
      where: {
        id: requestId,
        status: 'approved',
      },
    });

    if (!bloodRequest) {
      res.status(404).json({
        success: false,
        message: 'Blood request not found or not approved',
      });
      return;
    }

    // Check if user's blood group matches
    if (bloodRequest.bloodGroup !== req.user.bloodGroup) {
      res.status(400).json({
        success: false,
        message: 'Your blood group does not match this request',
      });
      return;
    }

    // Check if user has already opted in
    const existingOptIn = await StudentOptIn.findOne({
      where: {
        studentId: req.user.id,
        requestId,
      },
    });

    if (existingOptIn) {
      res.status(400).json({
        success: false,
        message: 'You have already opted in to this request',
      });
      return;
    }

    // Create opt-in record
    const optIn = await StudentOptIn.create({
      studentId: req.user.id,
      requestId,
    });

    // Get Socket.IO instance
    const io = req.app.get('io');

    // Notify admins
    emitToAdmins(io, 'student_opted_in', {
      message: `${req.user.name} opted in for ${bloodRequest.bloodGroup} request`,
      studentName: req.user.name,
      bloodGroup: bloodRequest.bloodGroup,
      requestId,
    });

    // Create notifications for admins
    const admins = await User.findAll({ where: { role: 'admin' } });
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: 'student_opted_in',
        title: 'Student Opted In',
        message: `${req.user.name} opted in for ${bloodRequest.requestorName}'s ${bloodRequest.bloodGroup} request`,
        metadata: { requestId, studentId: req.user.id },
      });
    }

    res.json({
      success: true,
      data: optIn,
      message: 'Successfully opted in to blood request',
    });
  } catch (error) {
    console.error('Opt in to request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getStudentOptIns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const optIns = await StudentOptIn.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: BloodRequest,
          as: 'request',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: optIns,
    });
  } catch (error) {
    console.error('Get student opt-ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};