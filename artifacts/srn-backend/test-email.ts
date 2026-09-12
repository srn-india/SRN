import dotenv from 'dotenv';
dotenv.config();

import { sendEmail, notifyUserOfOTP } from './src/utils/email.service';
import { isGmailOAuthConfigured } from './src/utils/gmail.service';

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE EMAIL FLOW VERIFICATION WITH GMAIL API');
  console.log('================================================================');
  console.log('Gmail OAuth API Ready:', isGmailOAuthConfigured() ? '✅ YES' : '❌ NO');

  const targetEmail = process.env.EMAIL_USER || 'srnindia.admin@gmail.com';
  console.log(`Target Recipient: ${targetEmail}\n`);

  // --- Test 1: OTP Verification Email ---
  console.log('1️⃣ Testing OTP Verification Email...');
  const t1 = Date.now();
  const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
  await notifyUserOfOTP(targetEmail, testOtp);
  console.log(`   ✅ OTP email dispatched in ${Date.now() - t1}ms (Code: ${testOtp})\n`);

  // --- Test 2: Payment Done & Receipt Email ---
  console.log('2️⃣ Testing Payment Done & Receipt Email...');
  const t2 = Date.now();
  await sendEmail(
    targetEmail,
    '✅ Payment Successful — SRN Membership Confirmed',
    `
      <h2>Thank You for Your Payment!</h2>
      <p>Your membership payment of <b>₹999</b> has been received and confirmed.</p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 4px 0;"><b>Transaction ID:</b> pay_test_${Date.now().toString(36)}</p>
        <p style="margin: 4px 0;"><b>Amount:</b> ₹999.00</p>
        <p style="margin: 4px 0;"><b>Status:</b> SUCCESS (ACTIVE)</p>
      </div>
      <p>Your official ID card is now available on your dashboard.</p>
      <center><a href="${process.env.FRONTEND_URL || 'https://srnindia.org'}/dashboard" class="btn">Go to Dashboard</a></center>
    `,
    'Your SRN Payment is Confirmed'
  );
  console.log(`   ✅ Payment Done email dispatched in ${Date.now() - t2}ms\n`);

  // --- Test 3: ID Card Sending with Attachment ---
  console.log('3️⃣ Testing Member ID Card Email with Attachment...');
  const t3 = Date.now();
  const mockCardUrl = `${process.env.SUPABASE_URL || 'https://cgmlrhewmemptyklkbrq.supabase.co'}/storage/v1/object/public/id-cards/sample-card.png`;
  
  await sendEmail(
    targetEmail,
    '🪪 Your Official SRN Member ID Card',
    `
      <h2>Your SRN Member ID Card is Ready!</h2>
      <p>Dear Member,</p>
      <p>Congratulations! Your official Sashakt Rashtra Nirman (SRN) identity card has been approved and issued.</p>
      <p>Click below to download your high-resolution digital card:</p>
      <center><a href="${mockCardUrl}" class="btn">Download ID Card</a></center>
      <p style="margin-top: 24px;">Please keep your ID card safe for access to exclusive events and community programs.</p>
    `,
    'Your ID Card is ready for download',
    [
      {
        filename: 'SRN_Welcome_Guide.txt',
        content: Buffer.from('Welcome to Sashakt Rashtra Nirman! Together we empower the youth of India.'),
        contentType: 'text/plain'
      }
    ]
  );
  console.log(`   ✅ ID Card email dispatched in ${Date.now() - t3}ms\n`);

  console.log('================================================================');
  console.log('🎉 ALL EMAIL FLOWS COMPLETED SUCCESSFULLY VIA GMAIL REST API!');
  console.log('================================================================');
}

runTestSuite().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
