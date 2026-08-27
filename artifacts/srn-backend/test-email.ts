import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'srnindia.admin@gmail.com',
    pass: 'vvfxuxdnvadzffvj',
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: '"Test" <srnindia.admin@gmail.com>',
      to: 'srnindia.admin@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main();
