import 'dotenv/config';
import crypto from 'crypto';

const API_BASE = "https://srn-backend.onrender.com/api";

async function run() {
  console.log("1. Logging in...");
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin.secure@srn-india.org",
      password: "P@$$w0rd!XyZ_9v8b$R#kQ2026"
    })
  });
  
  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.error("Login failed", loginData);
    return;
  }
  const token = loginData.data.accessToken;
  console.log("Logged in. Token acquired.");

  console.log("2. Creating order...");
  const orderRes = await fetch(`${API_BASE}/payments/order`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 50, type: "DONATION" })
  });
  
  const orderData = await orderRes.json();
  if (!orderData.success) {
    console.error("Order failed", orderData);
    return;
  }
  const razorpayOrderId = orderData.data.razorpayOrderId;
  console.log("Order created:", orderData.data.id, "Razorpay ID:", razorpayOrderId);

  console.log("3. Verifying payment...");
  const razorpay_payment_id = "pay_dummy_" + Date.now();
  const body = razorpayOrderId + "|" + razorpay_payment_id;
  const razorpay_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id,
      razorpay_signature,
      purpose: "Test Deployment Donation"
    })
  });
  
  const verifyData = await verifyRes.json();
  console.log("Verify result:", verifyData);
}
run();
