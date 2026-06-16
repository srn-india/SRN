const email = `testuser_${Date.now()}@example.com`;
const password = "password123";
let userToken = "";
let adminToken = "";
let complaintId = "";

const API_BASE = "http://localhost:4000/api";

async function runTest() {
  console.log("=== STARTING COMPLAINT FLOW TEST ===\n");

  // 1. Register a test user
  console.log("1. Registering a test user...");
  let res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email: email,
      password: password,
      phone: "1234567890",
      state: "Delhi",
      district: "New Delhi",
      gender: "Male"
    })
  });
  let data = await res.json();
  if (data.success) {
    console.log("   ✅ User registered successfully.");
  } else {
    console.error("   ❌ Failed to register user:", data.message);
    return;
  }

  // 1b. Since the user needs to be verified or logged in, the auth service returns accessToken on verify. 
  // Let's just bypass verification by manually setting it to verified in DB, OR just create complaint if it allows.
  // Wait, the protect middleware checks if user exists. We need a valid token.
  // Actually, we can just login as Admin and create a complaint for testing since Admin is also a user.
  console.log("\n2. Logging in as Admin...");
  res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin.secure@srn-india.org",
      password: "P@$$w0rd!XyZ_9v8b$R#kQ2026"
    })
  });
  
  data = await res.json();
  if (data.success && data.data.accessToken) {
    adminToken = data.data.accessToken;
    console.log("   ✅ Admin logged in successfully. Token acquired.");
  } else {
    console.error("   ❌ Admin login failed:", data.message);
    return;
  }

  // 3. Submit a complaint as Admin (Admin is also a user)
  console.log("\n3. Submitting a new complaint...");
  
  const formData = new FormData();
  formData.append("fullName", "Admin User");
  formData.append("email", "admin.secure@srn-india.org");
  formData.append("phone", "9876543210");
  formData.append("state", "Delhi");
  formData.append("category", "Infrastructure");
  formData.append("subject", "Test Complaint Subject");
  formData.append("description", "This is an automated test complaint description.");
  
  res = await fetch(`${API_BASE}/complaints`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${adminToken}`
    },
    body: formData
  });

  data = await res.json();
  if (data.success) {
    complaintId = data.data.id;
    console.log(`   ✅ Complaint submitted successfully! Ticket: ${data.data.ticket}, ID: ${complaintId}`);
  } else {
    console.error("   ❌ Failed to submit complaint:", data.message, data.error);
    return;
  }

  // 4. Fetch all complaints
  console.log("\n4. Fetching all complaints (Admin View)...");
  res = await fetch(`${API_BASE}/complaints`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${adminToken}`
    }
  });

  data = await res.json();
  if (data.success) {
    console.log(`   ✅ Fetched ${data.data.length} complaints.`);
    const found = data.data.find(c => c.id === complaintId);
    if (found) console.log("   ✅ New complaint found in the list.");
    else console.error("   ❌ New complaint missing from list!");
  } else {
    console.error("   ❌ Failed to fetch complaints:", data.message);
    return;
  }

  // 5. Update Complaint Status
  console.log(`\n5. Updating complaint status to 'Solved'...`);
  res = await fetch(`${API_BASE}/complaints/${complaintId}/status`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${adminToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: "Solved" })
  });

  data = await res.json();
  if (data.success && data.data.status === "Solved") {
    console.log("   ✅ Complaint status successfully updated to 'Solved'.");
  } else {
    console.error("   ❌ Failed to update status:", data.message);
    return;
  }

  // 6. Delete Complaint
  console.log(`\n6. Deleting the test complaint...`);
  res = await fetch(`${API_BASE}/complaints/${complaintId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${adminToken}`
    }
  });

  data = await res.json();
  if (data.success) {
    console.log("   ✅ Complaint deleted successfully.");
  } else {
    console.error("   ❌ Failed to delete complaint:", data.message);
    return;
  }

  console.log("\n=== COMPLAINT FLOW TEST COMPLETED SUCCESSFULLY ===");
}

runTest();
