import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const { prisma } = await import('../src/lib/prisma');
  
  // Delete all manual payments first
  const manualPayments = await prisma.manualPayment.deleteMany({});
  
  // Delete all donations (they reference payments, but we can just delete them)
  const donations = await prisma.donation.deleteMany({});
  
  // Delete all payments
  const payments = await prisma.payment.deleteMany({});
  
  console.log(`Deleted ${manualPayments.count} manual payments.`);
  console.log(`Deleted ${donations.count} donations.`);
  console.log(`Deleted ${payments.count} payments.`);
  
  console.log("All revenue data has been reset to zero.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
