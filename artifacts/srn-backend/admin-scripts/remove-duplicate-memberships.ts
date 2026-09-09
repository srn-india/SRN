import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/lib/prisma';

async function main() {
  const memberships = await prisma.membership.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  });

  const seenUsers = new Set<string>();
  let deletedCount = 0;

  for (const m of memberships) {
    if (seenUsers.has(m.userId)) {
      await prisma.membership.delete({ where: { id: m.id } });
      deletedCount++;
    } else {
      seenUsers.add(m.userId);
    }
  }

  console.log(`Deleted ${deletedCount} duplicate memberships.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
