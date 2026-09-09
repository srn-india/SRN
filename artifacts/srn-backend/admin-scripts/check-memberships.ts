import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/lib/prisma';

async function main() {
  const memberships = await prisma.membership.findMany({
    include: { user: true }
  });
  console.log(JSON.stringify(memberships, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
