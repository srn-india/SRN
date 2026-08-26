import { prisma } from './src/lib/prisma';
async function main() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true }
  });
  console.log("Latest 5 Payments in Production:");
  payments.forEach(p => console.log(`${p.id} | ${p.status} | ${p.type} | ${p.amount} | User: ${p.user?.email} | Date: ${p.createdAt}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
