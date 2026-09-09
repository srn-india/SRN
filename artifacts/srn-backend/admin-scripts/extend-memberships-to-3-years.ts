import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Fetching all memberships...');
  const memberships = await prisma.membership.findMany();

  console.log(`Found ${memberships.length} memberships. Updating duration to 3 years...`);

  let updatedCount = 0;

  for (const membership of memberships) {
    const startDate = new Date(membership.startDate);
    const expectedEndDate = new Date(startDate);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + 36);

    // Only update if it's not already 3 years (with some margin for time variation)
    // We can just update it safely
    await prisma.membership.update({
      where: { id: membership.id },
      data: { endDate: expectedEndDate },
    });
    
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} memberships to have a 3-year duration.`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
