import 'dotenv/config';
import { generateAndUploadIdCard } from '../src/modules/membership/idcard.service';
import { prisma } from '../src/lib/prisma';

async function test() {
  const membership = await prisma.membership.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });
  if (!membership) {
    console.log('No active membership found to test.');
    return;
  }
  console.log(`Testing with membership ${membership.id}`);
  const url = await generateAndUploadIdCard(membership.id);
  console.log('Result URL:', url);
}

test().catch(console.error);
