const email = `testadmin_${Date.now()}@example.com`;
const password = "password123";
let adminToken = "";

const API_BASE = "http://localhost:4000/api";

async function runTest() {
  console.log("1. Logging in as Admin...");
  let res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin.secure@srn-india.org",
      password: "P@$$w0rd!XyZ_9v8b$R#kQ2026"
    })
  });
  
  let data = await res.json();
  if (data.success && data.data.accessToken) {
    adminToken = data.data.accessToken;
    console.log("   ✅ Admin logged in successfully.");
  } else {
    console.error("   ❌ Admin login failed:", data.message);
    return;
  }

  console.log("\n2. Submitting a new event...");
  const formData = new FormData();
  formData.append("title", "National Youth Empowerment Summit 2026");
  formData.append("description", "Join us for an inspiring day dedicated to the youth.");
  formData.append("location", "New Delhi");
  formData.append("date", "2026-06-16T12:00");
  
  res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${adminToken}`
    },
    body: formData
  });

  data = await res.json();
  if (data.success) {
    console.log(`   ✅ Event submitted successfully!`);
  } else {
    console.error("   ❌ Failed to submit event:", data);
  }
}

runTest();
