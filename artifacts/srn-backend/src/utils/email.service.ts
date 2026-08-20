import nodemailer from 'nodemailer';

/**
 * Email Service utility for sending transactional emails.
 * In development, this uses a mock Ethereal Email account.
 * In production, configure SMTP credentials via environment variables.
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'mock_user',
    pass: process.env.EMAIL_PASS || 'mock_pass',
  },
});

export const wrapWithSRNBranding = (content: string, preheader: string = 'Update from Sashakt Rashtra Nirman') => {
  // Use a public URL for the logo in emails (emails cannot load local images like /srn-logo.png)
  // Using the live logo hosted on your GitHub repository so email clients can load it correctly
  const logoUrl = 'https://raw.githubusercontent.com/srn-india/SRN/main/artifacts/srn-website/public/srn-logo.png'; 
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SRN Update</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #FDF5EC;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      margin-top: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .email-header {
      background-color: #F15A22; /* SRN Saffron Orange */
      padding: 24px;
      text-align: center;
    }
    .email-header img {
      max-width: 80px;
      height: auto;
      background-color: white;
      border-radius: 50%;
      padding: 8px;
    }
    .email-header h1 {
      color: #ffffff;
      margin: 10px 0 0 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-body {
      padding: 32px;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #F15A22;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <!-- Preheader text (Hidden in email body, visible in inbox preview) -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheader}
  </div>

  <div class="email-container">
    <div class="email-header">
      <!-- Replace src with your actual hosted logo URL -->
      <img src="${logoUrl}" alt="SRN Logo" onerror="this.style.display='none'">
      <h1>Sashakt Rashtra Nirman</h1>
    </div>
    
    <div class="email-body">
      ${content}
    </div>
    
    <div class="email-footer">
      <p>Sashakt Rashtra Nirman (SRN)</p>
      <p>Building a stronger, empowered India through youth action and education.</p>
      <p style="margin-top: 12px; font-size: 11px;">
        © ${new Date().getFullYear()} SRN India. All rights reserved.<br>
        This is an automated message, please do not reply directly to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export const notifyAdminOfPayment = async (paymentDetails: any) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@srn.org.in';
  
  const content = `
    <h2>New Payment Received</h2>
    <p>A new payment has been successfully processed.</p>
    <ul>
      <li><strong>User:</strong> ${paymentDetails.userName || 'Unknown'} (${paymentDetails.userEmail || 'N/A'})</li>
      <li><strong>Type:</strong> ${paymentDetails.type}</li>
      <li><strong>Amount:</strong> ₹${paymentDetails.amount}</li>
      <li><strong>Status:</strong> ${paymentDetails.status}</li>
      <li><strong>Order ID:</strong> ${paymentDetails.razorpayOrderId}</li>
      <li><strong>Payment ID:</strong> ${paymentDetails.razorpayPaymentId}</li>
    </ul>
    <a href="${process.env.FRONTEND_URL}/admin/payments" class="btn">View in Admin Panel</a>
  `;

  return sendEmail(adminEmail, 'New Payment Received', content, 'A new payment was successfully processed');
};

export const notifyUserOfOTP = async (email: string, otpCode: string) => {
  const content = `
    <h2>Verify Your Identity</h2>
    <p>Please use the following verification code to complete your login or registration.</p>
    <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border: 2px dashed #E8622A; border-radius: 8px; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #E8622A;">${otpCode}</span>
    </div>
    <p>This code will expire in exactly 10 minutes. Please do not share this code with anyone.</p>
    <p>If you did not request this code, you can safely ignore this email.</p>
  `;

  return sendEmail(
    email, 
    'Your SRN Verification Code', 
    content,
    `Your verification code is ${otpCode}`
  );
};

export const sendEmail = async (to: string, subject: string, htmlContent: string, preheader?: string) => {
  try {
    const brandedHtml = wrapWithSRNBranding(htmlContent, preheader);

    const mailOptions = {
      from: `"Sashakt Rashtra Nirman" <${process.env.EMAIL_FROM || 'no-reply@srn.org'}>`,
      to,
      subject,
      html: brandedHtml,
    };

    if (!process.env.EMAIL_HOST) {
      console.log('---------------------------------------');
      console.log(`Email Sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content length: ${brandedHtml.length} characters`);
      console.log('---------------------------------------');
      return { messageId: 'mock_id' };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Send Error:', error);
    throw new Error('Failed to send email');
  }
};
