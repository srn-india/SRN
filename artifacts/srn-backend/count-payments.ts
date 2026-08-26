import 'dotenv/config';
import { prisma } from './src/lib/prisma';
async function test() {
  const count = await prisma.payment.count();
  console.log('Total payments:', count);
}
test();
