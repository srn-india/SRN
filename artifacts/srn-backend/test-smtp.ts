import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srnindia.admin@gmail.com',
    pass: 'vvfxuxdnvadzffvj',
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: 'srnindia.admin@gmail.com',
      to: 'srnindia.admin@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    });
    console.log('Success:', info.messageId);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
