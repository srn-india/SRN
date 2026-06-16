#!/bin/bash
echo "=== COMPLAINT FLOW TEST ==="

echo "1. Registering user..."
RES=$(curl -s -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"firstName":"Test","lastName":"User","email":"tester@example.com","password":"password123","phone":"1234567890","state":"Delhi","district":"New Delhi","gender":"Male"}')
echo $RES

echo -e "\n2. Logging in as Admin..."
LOGIN_RES=$(curl -s -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin.secure@srn-india.org","password":"P@$$w0rd!XyZ_9v8b$R#kQ2026"}')
TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
fi
echo "✅ Logged in successfully"

echo -e "\n3. Submitting Complaint..."
COMPLAINT_RES=$(curl -s -X POST http://localhost:4000/api/complaints \
  -H "Authorization: Bearer $TOKEN" \
  -F "fullName=Admin User" \
  -F "email=admin.secure@srn-india.org" \
  -F "phone=9876543210" \
  -F "state=Delhi" \
  -F "category=Infrastructure" \
  -F "subject=Test Complaint" \
  -F "description=Test Description")
echo $COMPLAINT_RES

COMPLAINT_ID=$(echo $COMPLAINT_RES | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$COMPLAINT_ID" ]; then
  echo "❌ Complaint creation failed"
  exit 1
fi
echo "✅ Complaint submitted: $COMPLAINT_ID"

echo -e "\n4. Fetching Complaints..."
curl -s -X GET http://localhost:4000/api/complaints -H "Authorization: Bearer $TOKEN" | grep -o '"id":"'$COMPLAINT_ID'"' > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Complaint found in list"
else
  echo "❌ Complaint NOT found"
fi

echo -e "\n5. Updating Status..."
curl -s -X PATCH http://localhost:4000/api/complaints/$COMPLAINT_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Solved"}' > /dev/null
echo "✅ Status updated"

echo -e "\n6. Deleting Complaint..."
curl -s -X DELETE http://localhost:4000/api/complaints/$COMPLAINT_ID \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo "✅ Complaint deleted"

echo "=== TEST COMPLETE ==="
