import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function removeMembership() {
  console.log('--- SRN Admin: Remove Membership Status ---');
  
  rl.question('Enter the email address of the user: ', async (email) => {
    try {
      if (!email || !email.includes('@')) {
        console.log('❌ Invalid email address provided.');
        process.exit(1);
      }

      // 1. Find the user
      const user = await prisma.user.findUnique({
        where: { email: email.trim() }
      });

      if (!user) {
        console.log(`❌ No user found with the email: ${email}`);
        process.exit(1);
      }

      // 2. Find active membership for the user
      const activeMembership = await prisma.membership.findFirst({
        where: { 
          userId: user.id,
          status: 'ACTIVE'
        }
      });

      if (!activeMembership) {
        console.log(`⚠️  The user ${user.firstName} ${user.lastName} (${email}) does not have an active membership.`);
        process.exit(0);
      }

      // 3. Confirm with admin
      rl.question(`Found active membership for ${user.firstName} ${user.lastName}. Are you sure you want to CANCEL it? (yes/no): `, async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          // 4. Update status to CANCELLED and downgrade user role
          await prisma.membership.update({
            where: { id: activeMembership.id },
            data: { status: 'CANCELLED' }
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'USER' }
          });
          
          console.log(`✅ Successfully revoked membership for ${email}. Their status is now CANCELLED.`);
        } else {
          console.log('Action aborted. The membership was NOT cancelled.');
        }
        
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ An error occurred:', error);
      process.exit(1);
    }
  });
}

removeMembership();
