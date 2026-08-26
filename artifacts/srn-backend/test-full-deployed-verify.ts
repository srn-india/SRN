import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

process.env.DATABASE_URL = "postgresql://postgres.cgmlrhewmemptyklkbrq:az0ymF43qDgttf1E@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'admin.secure@srn-india.org' } });
  if (!user) throw new Error('No user found');

  const razorpay_order_id = "order_test_" + Date.now();
  const razorpay_payment_id = "pay_test_" + Date.now();

  const mockPayment = await prisma.payment.create({
    data: {
      userId: user.id,
      amount: 999,
      type: 'DONATION',
      status: 'PENDING',
      provider: 'RAZORPAY',
      razorpayOrderId: razorpay_order_id
    }
  });

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const razorpay_signature = crypto
    .createHmac('sha256', "LhldQcB9jSIqb0j1qvxw7fBD") // using RAZORPAY_KEY_SECRET from user's env
    .update(body.toString())
    .digest('hex');

  // get token for user
  const authRes = await fetch("https://srn-backend.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin.secure@srn-india.org", password: "AdminPassword123!" })
  });
  const authData = await authRes.json();
  const token = authData.data.accessToken;

  console.log("Hitting verification endpoint on deployed server...");
  const res = await fetch("https://srn-backend.onrender.com/api/payments/verify", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      purpose: "Deployed Test Donation 999"
    })
  });

  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Response:", data);
}

main().catch(console.error).finally(() => prisma.$disconnect());
