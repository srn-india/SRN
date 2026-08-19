import { config } from 'dotenv';
config();
import { prisma } from './src/lib/prisma';

async function main() {
  const membershipId = '946dea84-40b8-409c-b71a-da3070a54153';
  
  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    include: { user: true }
  });

  if (membership) {
    await prisma.membership.delete({
      where: { id: membershipId }
    });
    console.log(`Deleted membership ${membershipId} for ${membership.user.email}`);

    await prisma.user.update({
      where: { id: membership.user.id },
      data: { avatar: null, profilePicture: null }
    });
    console.log(`Reset avatar for ${membership.user.email}`);
  } else {
    console.log('Membership not found');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
