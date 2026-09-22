import nodemailer from 'nodemailer';
import { isGmailOAuthConfigured, sendGmailViaAPI } from './gmail.service';

/**
 * Email Service utility for sending transactional emails.
 * Supports:
 * 1. High-speed Google Gmail REST API via OAuth2 (using GMAIL_TOKEN_B64 or token.pickle)
 * 2. Pooled SMTP (via EMAIL_HOST, EMAIL_USER, etc.)
 * 3. Mock logger in development if neither is configured.
 */

let pooledTransporter: nodemailer.Transporter | null = null;
const getTransporter = () => {
  if (!pooledTransporter) {
    pooledTransporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 5,
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      auth: {
        user: process.env.EMAIL_USER || 'mock_user',
        pass: process.env.EMAIL_PASS || 'mock_pass',
      },
    });
  }
  return pooledTransporter;
};

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

export const sendRashtraNirmanKartaOtpEmail = async (email: string, otpCode: string, applicantName?: string) => {
  const greeting = applicantName?.trim() ? `Dear ${applicantName.trim()},` : 'Dear Nation Builder,';
  const preheader = `Your verification code is ${otpCode} - Welcome to Sashakt Rashtra Nirman Active Membership`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 6px 16px; background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 9999px; color: #92400E; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
        🇮🇳 Rashtra Nirman Karta · Active Membership
      </div>
      <h2 style="color: #2C1810; margin-top: 14px; margin-bottom: 6px; font-size: 24px; font-weight: 800;">
        Active Membership Verification Code
      </h2>
      <p style="color: #7A5C45; font-size: 14px; margin: 0;">
        Complete your email verification for Sashakt Rashtra Nirman
      </p>
    </div>

    <p style="font-size: 16px; color: #2C1810; font-weight: 600; margin-bottom: 8px;">
      ${greeting}
    </p>
    <p style="color: #4B5563; font-size: 14px; line-height: 1.7; margin-bottom: 16px;">
      Thank you for stepping forward to serve the nation as an active member (<strong>Rashtra Nirman Karta</strong>) with <strong>Sashakt Rashtra Nirman (SRN)</strong>. To verify your email address and proceed with your official registration, please use the 6-digit confidential One-Time Password (OTP) below:
    </p>

    <!-- OTP Card -->
    <div style="margin: 28px 0; padding: 24px; background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 2px solid #F59E0B; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);">
      <div style="font-size: 12px; text-transform: uppercase; font-weight: 800; color: #B45309; letter-spacing: 1.5px; margin-bottom: 8px;">
        Official Verification Code (6-Digit OTP)
      </div>
      <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #E8622A; font-family: monospace; line-height: 1.2;">
        ${otpCode}
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #78350F; font-weight: 600;">
        ⏱️ Valid for 10 minutes only · Do not share this code
      </div>
    </div>

    <!-- Active Membership Role Highlights -->
    <div style="margin: 24px 0; padding: 18px 20px; background-color: #FDF5EC; border-left: 4px solid #E8622A; border-radius: 0 8px 8px 0;">
      <h4 style="margin: 0 0 10px 0; color: #2C1810; font-size: 14px; font-weight: 800;">
        🎖️ Key Privileges of a Rashtra Nirman Karta:
      </h4>
      <ul style="margin: 0; padding-left: 18px; color: #4B5563; font-size: 13px; line-height: 1.8;">
        <li><strong>Grassroots Leadership:</strong> Direct eligibility to hold executive posts across Block, District, and State committees.</li>
        <li><strong>Official Verified ID Card:</strong> Issuance of a verified digital and physical SRN Membership Card with secure QR validation.</li>
        <li><strong>Decision-Making Authority:</strong> Direct consultation and strategic coordination with state and national leadership.</li>
      </ul>
    </div>

    <p style="color: #6B7280; font-size: 12px; line-height: 1.6; margin-top: 20px;">
      ⚠️ <em>Security Notice: This verification code is strictly confidential. If you did not request this verification, please disregard this email.</em>
    </p>

    <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #92400E; font-weight: 700; font-size: 13px;">
      "Empowered Citizens, Resilient Society, Stronger Nation"
    </div>
  `;

  return sendEmail(
    email,
    `[SRN] Verification Code for Rashtra Nirman Karta (Active Membership): ${otpCode}`,
    content,
    preheader
  );
};

export const sendRashtraMitraOtpEmail = async (email: string, otpCode: string, applicantName?: string) => {
  const greeting = applicantName?.trim() ? `Dear ${applicantName.trim()},` : 'Dear Supporter,';
  const preheader = `Your verification code is ${otpCode} - Welcome to the Rashtra Mitra Network`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 6px 16px; background-color: #ECFDF5; border: 1px solid #10B981; border-radius: 9999px; color: #065F46; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
        🤝 Rashtra Mitra · Supporter Membership
      </div>
      <h2 style="color: #2C1810; margin-top: 14px; margin-bottom: 6px; font-size: 24px; font-weight: 800;">
        Rashtra Mitra Verification Code
      </h2>
      <p style="color: #7A5C45; font-size: 14px; margin: 0;">
        Complete your email verification for Sashakt Rashtra Nirman
      </p>
    </div>

    <p style="font-size: 16px; color: #2C1810; font-weight: 600; margin-bottom: 8px;">
      ${greeting}
    </p>
    <p style="color: #4B5563; font-size: 14px; line-height: 1.7; margin-bottom: 16px;">
      Welcome to the <strong>Sashakt Rashtra Nirman (SRN)</strong> family as a <strong>Rashtra Mitra</strong> (Supporter Member). We are honored to have you join our nationwide civic initiative. To verify your email address and activate your supporter membership, please enter the 6-digit One-Time Password (OTP) below:
    </p>

    <!-- OTP Card -->
    <div style="margin: 28px 0; padding: 24px; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #10B981; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);">
      <div style="font-size: 12px; text-transform: uppercase; font-weight: 800; color: #047857; letter-spacing: 1.5px; margin-bottom: 8px;">
        Official Verification Code (6-Digit OTP)
      </div>
      <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #059669; font-family: monospace; line-height: 1.2;">
        ${otpCode}
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #065F46; font-weight: 600;">
        ⏱️ Valid for 10 minutes only · Do not share this code
      </div>
    </div>

    <!-- Rashtra Mitra Benefits Highlights -->
    <div style="margin: 24px 0; padding: 18px 20px; background-color: #FDF5EC; border-left: 4px solid #10B981; border-radius: 0 8px 8px 0;">
      <h4 style="margin: 0 0 10px 0; color: #2C1810; font-size: 14px; font-weight: 800;">
        🌱 Your Role as a Rashtra Mitra:
      </h4>
      <ul style="margin: 0; padding-left: 18px; color: #4B5563; font-size: 13px; line-height: 1.8;">
        <li><strong>Community Action:</strong> Invitations to join blood donation camps, cleanliness drives, and disaster relief activities.</li>
        <li><strong>Janmant Open Platform:</strong> Complimentary access to citizen journalism articles and open national discourse forums.</li>
        <li><strong>Monthly Circulars:</strong> Direct digital updates on key social campaigns and community progress across India.</li>
      </ul>
    </div>

    <p style="color: #6B7280; font-size: 12px; line-height: 1.6; margin-top: 20px;">
      ⚠️ <em>Security Notice: This verification code is confidential. If you did not request this, you can safely ignore this email.</em>
    </p>

    <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #047857; font-weight: 700; font-size: 13px;">
      "One Step for the Nation · Citizen Action for National Progress"
    </div>
  `;

  return sendEmail(
    email,
    `[SRN] Verification Code for Rashtra Mitra (Supporter Membership): ${otpCode}`,
    content,
    preheader
  );
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

export const sendEmail = async (to: string, subject: string, htmlContent: string, preheader?: string, attachments?: any[]) => {
  try {
    const brandedHtml = wrapWithSRNBranding(htmlContent, preheader);

    // 1. Prioritize Gmail API via OAuth2 (fastest ~150-250ms, no SMTP handshake)
    if (isGmailOAuthConfigured()) {
      try {
        return await sendGmailViaAPI({
          to,
          subject,
          html: brandedHtml,
          attachments,
        });
      } catch (oauthError: any) {
        console.warn(`[EmailService] Gmail OAuth API failed (${oauthError?.message || oauthError}). Falling back to SMTP...`);
      }
    }

    // 2. Mock mode for local dev if neither Gmail OAuth nor SMTP host is configured
    if (!process.env.EMAIL_HOST) {
      console.log('---------------------------------------');
      console.log(`[Dev Email Mock] Sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content length: ${brandedHtml.length} characters`);
      console.log('---------------------------------------');
      return { messageId: 'mock_id' };
    }

    // 3. Pooled SMTP
    if (!isGmailOAuthConfigured()) {
      console.info(`[EmailService] Sending via SMTP (${process.env.EMAIL_HOST})...`);
    }
    const mailOptions = {
      from: `"Sashakt Rashtra Nirman" <${process.env.EMAIL_FROM || 'no-reply@srn.org'}>`,
      to,
      subject,
      html: brandedHtml,
      attachments,
    };

    const info = await getTransporter().sendMail(mailOptions);
    console.log('Message sent via SMTP: %s', info.messageId);
    return info;
  } catch (error: any) {
    console.error('Email Send Error:', error);
    throw new Error(error?.message || 'Failed to send email');
  }
};
