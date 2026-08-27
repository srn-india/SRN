import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const { prisma } = await import('../src/lib/prisma');
  const result = await prisma.membership.deleteMany({});
  console.log(`Deleted ${result.count} memberships.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
