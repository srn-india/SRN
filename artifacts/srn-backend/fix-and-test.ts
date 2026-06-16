import { prisma } from './src/lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'anshjohnson69@gmail.com' } });
  if (!user) {
    console.log("User not found");
    return;
  }
  
  // Try to update existing anonymous applications that match the email
  const updated = await prisma.postApplication.updateMany({
    where: { email: 'anshjohnson69@gmail.com', userId: null },
    data: { userId: user.id }
  });
  console.log(`Updated ${updated.count} anonymous applications.`);
  
  if (updated.count === 0) {
    // If none exist, create one
    await prisma.postApplication.create({
      data: {
        userId: user.id,
        fullName: user.firstName + ' ' + user.lastName,
        email: user.email,
        phone: '1234567890',
        gender: 'Male',
        dob: '2000-01-01',
        address: 'Test Address',
        qualification: 'Test Qualification',
        appliedPosition: 'Test Position',
        socialContribution: 'Test Social',
        whyJoin: 'Test Join',
        status: 'Pending'
      }
    });
    console.log("Created a new test application.");
  }

  const apps = await prisma.postApplication.findMany({ where: { userId: user.id } });
  console.log("User applications:", apps.map(a => ({ id: a.id, status: a.status, userId: a.userId })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
