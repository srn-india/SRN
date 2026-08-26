import { notifyAdminOfPayment } from './src/utils/email.service';
import { sendEmail } from './src/utils/email.service';

async function main() {
  console.log("Sending test email to srnindia.admin@gmail.com...");
  try {
    await sendEmail(
      'srnindia.admin@gmail.com',
      'Direct SMTP Test',
      '<p>This is a direct SMTP test to check if emails can be sent at all.</p>'
    );
    console.log("Test email sent successfully.");
  } catch (err) {
    console.error("Test email failed:", err);
  }
}

main();
