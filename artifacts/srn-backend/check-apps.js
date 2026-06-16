const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const apps = await prisma.postApplication.findMany();
  console.log("All Applications:");
  console.log(apps);
}
main().catch(console.error).finally(() => prisma.$disconnect());
