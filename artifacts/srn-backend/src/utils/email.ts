import nodemailer from 'nodemailer';

// Store transporter instance to reuse it
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;
  
  // For production, you would configure SMTP with real credentials like Gmail/SendGrid
  // Here we use Ethereal which catches emails and lets us view them online
  const testAccount = await nodemailer.createTestAccount();
  
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  
  return transporter;
}

export async function sendOTPEmail(to: string, otpCode: string): Promise<boolean> {
  try {
    const mailTransporter = await getTransporter();
    
    const info = await mailTransporter.sendMail({
      from: '"SRN Team" <noreply@srn.org.in>', // sender address
      to, // list of receivers
      subject: "Your SRN Verification Code", // Subject line
      text: `Your verification code is: ${otpCode}. It expires in 10 minutes.`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2C1810;">Welcome to Sashakt Rashtra Nirman</h2>
          <p>Your email verification code is:</p>
          <h1 style="color: #E8622A; font-size: 32px; letter-spacing: 5px;">${otpCode}</h1>
          <p>This code will expire in 10 minutes. Do not share this with anyone.</p>
        </div>
      `, 
    });

    console.log("OTP Message sent: %s", info.messageId);
    console.log("-----------------------------------------");
    console.log("Preview OTP Email URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
    
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}

export async function sendMembershipEmail(to: string, name: string, idCardUrl: string): Promise<boolean> {
  try {
    const mailTransporter = await getTransporter();
    
    const info = await mailTransporter.sendMail({
      from: '"SRN Team" <noreply@srn.org.in>', // sender address
      to, // list of receivers
      subject: "Welcome to SRN - Your Membership is Active!", // Subject line
      text: `Hello ${name},\n\nYour membership is now active! You can download your official ID card here: ${idCardUrl}\n\nThank you,\nSRN Team`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2C1810;">Welcome to Sashakt Rashtra Nirman</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Congratulations! Your membership is now fully active.</p>
          <p>You can download your official SRN ID card by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${idCardUrl}" style="background-color: #E8622A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Download ID Card</a>
          </div>
          <p>Thank you for joining us.</p>
        </div>
      `, 
    });

    console.log("Membership Message sent: %s", info.messageId);
    console.log("-----------------------------------------");
    console.log("Preview Membership Email URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
    
    return true;
  } catch (error) {
    console.error("Error sending Membership email:", error);
    return false;
  }
}
