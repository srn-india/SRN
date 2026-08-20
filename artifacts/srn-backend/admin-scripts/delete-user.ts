import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function deleteUser() {
  console.log('--- SRN Admin: DANGER - Delete User Account ---');
  console.log('WARNING: This will permanently delete the user and all their related data (memberships, payments, posts, etc.) from the remote database.');
  
  rl.question('Enter the email address of the user you want to permanently delete: ', async (email) => {
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

      // 2. Confirm with admin twice
      console.log(`\n⚠️  FOUND USER: ${user.firstName} ${user.lastName} (${email})`);
      rl.question(`Are you ABSOLUTELY SURE you want to permanently delete this user? This cannot be undone. Type 'DELETE' to confirm: `, async (answer) => {
        if (answer === 'DELETE') {
          console.log('Deleting user and cascading all related records...');
          
          // 3. Delete user
          // Prisma's onDelete: Cascade will automatically delete their memberships, payments, posts, comments, etc.
          await prisma.user.delete({
            where: { id: user.id }
          });
          
          console.log(`✅ Successfully and permanently deleted user ${email} from the database.`);
        } else {
          console.log('❌ Action aborted. The user was NOT deleted.');
        }
        
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ An error occurred while trying to delete the user:', error);
      process.exit(1);
    }
  });
}

deleteUser();
