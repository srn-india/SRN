import { prisma } from './src/lib/prisma';
import { generateTokens } from './src/utils/jwt';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'anshjohnson69@gmail.com' } });
  if (!user) {
    console.log("User not found");
    return;
  }
  
  const tokens = generateTokens(user.id, user.role);
  
  const formData = new FormData();
  formData.append('fullName', user.firstName + ' ' + user.lastName);
  formData.append('email', user.email);
  formData.append('phone', '1234567890');
  formData.append('gender', 'Male');
  formData.append('dob', '2000-01-01');
  formData.append('address', 'Test Address');
  formData.append('qualification', 'Test Qualification');
  formData.append('appliedPosition', 'Test Position');
  formData.append('socialContribution', 'Test Social');
  formData.append('whyJoin', 'Test Join');
  
  const res = await fetch('http://localhost:4000/api/applications', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`
    },
    body: formData
  });
  
  const data = await res.json();
  console.log("Application creation response:", data);

  const meRes = await fetch('http://localhost:4000/api/applications/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`
    }
  });

  const meData = await meRes.json();
  console.log("My application fetch response:", meData);
}

main().catch(console.error).finally(() => prisma.$disconnect());
