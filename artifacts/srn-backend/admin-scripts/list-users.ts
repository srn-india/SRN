import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function listUsers() {
  console.log('--- SRN Admin: List All Users ---');
  console.log('Fetching users from the remote database...\n');
  
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          take: 1
        }
      }
    });

    if (users.length === 0) {
      console.log('No users found in the database.');
      process.exit(0);
    }

    // Format data for console.table
    const formattedUsers = users.map(u => ({
      'Name': `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A',
      'Email': u.email,
      'Role': u.role,
      'Verified': u.isVerified ? '✅' : '❌',
      'Membership': u.memberships.length > 0 ? `ACTIVE (${u.memberships[0].plan})` : 'NONE',
      'Joined': u.createdAt.toLocaleDateString('en-IN')
    }));

    console.table(formattedUsers);
    console.log(`\n✅ Total Users: ${users.length}`);
    
  } catch (error) {
    console.error('❌ An error occurred while fetching users:', error);
  } finally {
    process.exit(0);
  }
}

listUsers();
