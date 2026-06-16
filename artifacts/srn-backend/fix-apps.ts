import { prisma } from './src/lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'anshjohnson69@gmail.com' } });
  if (user) {
    const updated = await prisma.postApplication.updateMany({
      where: { email: 'anshjohnson69@gmail.com', userId: null },
      data: { userId: user.id }
    });
    console.log(`Updated ${updated.count} applications.`);
  } else {
    console.log("User not found");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
