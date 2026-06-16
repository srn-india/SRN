import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const apps = await prisma.postApplication.findMany();
  console.log("Applications:");
  apps.forEach(a => console.log(`- ID: ${a.id}, Email: ${a.email}, UserID: ${a.userId}, Status: "${a.status}"`));
}

main().finally(() => prisma.$disconnect());
