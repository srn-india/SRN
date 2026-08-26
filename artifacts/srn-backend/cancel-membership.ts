import dotenv from 'dotenv';
dotenv.config();
import { prisma } from './src/lib/prisma';
async function run() {
  const email = "teesstting23213@gmail.com";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found');
    return;
  }
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id, status: 'ACTIVE' }
  });
  if (!membership) {
    console.log('No active membership found');
    return;
  }
  await prisma.membership.update({
    where: { id: membership.id },
    data: { status: 'CANCELLED' }
  });
  console.log('Successfully cancelled membership');
}
run();
