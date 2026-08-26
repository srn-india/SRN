import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import { verifyPayment, createOrder } from './src/modules/payment/payment.service';
import crypto from 'crypto';

async function test() {
  console.log("Starting donation test...");
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error('No user found');
    
    console.log("Creating order...");
    const order = await createOrder(user.id, 500, 'DONATION');
    
    const razorpay_payment_id = "pay_dummy" + Date.now();
    const razorpay_order_id = order.razorpayOrderId as string;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const razorpay_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest('hex');
      
    console.log("Verifying payment...");
    const start = Date.now();
    const result = await verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      purpose: "Test Donation"
    }, user.id);
    
    console.log(`Success! API Response returned in ${Date.now() - start}ms`);
    
    // Keep process alive to let background queue finish
    console.log("Waiting for prioritized background email queue to finish...");
    await new Promise(resolve => setTimeout(resolve, 10000));
  } catch (error) {
    console.error("Test failed:", error);
  }
}
test();
