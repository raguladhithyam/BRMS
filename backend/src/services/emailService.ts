import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: "mra20031006@gmail.com",
    pass: "T2HJ0vgbVO7RrMD4",
  },
});

interface EmailData {
  to: string[];
  subject: string;
  template: string;
  data: any;
}

const templates = {
  newBloodRequest: (data: any) => `
    <h2>New Blood Request Submitted</h2>
    <p>A new blood request has been submitted and requires your review:</p>
    <ul>
      <li><strong>Requestor:</strong> ${data.requestorName}</li>
      <li><strong>Blood Group:</strong> ${data.bloodGroup}</li>
      <li><strong>Units:</strong> ${data.units}</li>
      <li><strong>Urgency:</strong> ${data.urgency}</li>
      <li><strong>Hospital:</strong> ${data.hospitalName}</li>
      <li><strong>Location:</strong> ${data.location}</li>
      <li><strong>Required Date:</strong> ${new Date(data.dateTime).toLocaleString()}</li>
    </ul>
    <p>Please log in to the admin panel to review and approve this request.</p>
  `,

  requestApproved: (data: any) => `
    <h2>Blood Request Available</h2>
    <p>A blood request matching your blood type has been approved:</p>
    <ul>
      <li><strong>Requestor:</strong> ${data.requestorName}</li>
      <li><strong>Blood Group:</strong> ${data.bloodGroup}</li>
      <li><strong>Units:</strong> ${data.units}</li>
      <li><strong>Urgency:</strong> ${data.urgency}</li>
      <li><strong>Hospital:</strong> ${data.hospitalName}</li>
      <li><strong>Location:</strong> ${data.location}</li>
      <li><strong>Required Date:</strong> ${new Date(data.dateTime).toLocaleString()}</li>
    </ul>
    <p>If you're available to help, please log in to opt in for this request.</p>
  `,

  requestRejected: (data: any) => `
    <h2>Blood Request Update</h2>
    <p>Dear ${data.requestorName},</p>
    <p>We regret to inform you that your blood request could not be approved at this time.</p>
    <p><strong>Reason:</strong> ${data.reason}</p>
    <p>Please feel free to submit a new request or contact us for assistance.</p>
  `,

  donorAssigned: (data: any) => `
    <h2>Donor Found!</h2>
    <p>Dear ${data.requestorName},</p>
    <p>Great news! We have found a donor for your ${data.bloodGroup} blood request.</p>
    <p><strong>Donor Contact Information:</strong></p>
    <ul>
      <li><strong>Name:</strong> ${data.donorName}</li>
      <li><strong>Email:</strong> ${data.donorEmail}</li>
      <li><strong>Phone:</strong> ${data.donorPhone}</li>
    </ul>
    <p>Please coordinate with the donor to arrange the donation.</p>
  `,

  donorSelected: (data: any) => `
    <h2>You've Been Selected as a Donor</h2>
    <p>Dear ${data.donorName},</p>
    <p>Thank you for opting in! You have been selected to donate ${data.bloodGroup} blood.</p>
    <p><strong>Requestor Contact Information:</strong></p>
    <ul>
      <li><strong>Name:</strong> ${data.requestorName}</li>
      <li><strong>Email:</strong> ${data.requestorEmail}</li>
      <li><strong>Phone:</strong> ${data.requestorPhone}</li>
    </ul>
    <p><strong>Donation Details:</strong></p>
    <ul>
      <li><strong>Hospital:</strong> ${data.hospitalName}</li>
      <li><strong>Location:</strong> ${data.location}</li>
      <li><strong>Date & Time:</strong> ${new Date(data.dateTime).toLocaleString()}</li>
    </ul>
    <p>Please coordinate with the requestor to finalize the donation arrangements.</p>
  `,

  studentWelcome: (data: any) => `
    <h2>Welcome to BloodConnect</h2>
    <p>Dear ${data.name},</p>
    <p>Your student donor account has been created successfully!</p>
    <p><strong>Login Credentials:</strong></p>
    <ul>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Temporary Password:</strong> ${data.tempPassword}</li>
    </ul>
    <p>Please log in and change your password: <a href="${data.loginUrl}">Login Here</a></p>
    <p>Thank you for joining our life-saving community!</p>
  `,
};

export const sendEmail = async (emailData: EmailData): Promise<void> => {
  try {
    const { to, subject, template, data } = emailData;

    const htmlContent = templates[template as keyof typeof templates](data);

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: to.join(', '),
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${to.join(', ')}`);
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
};