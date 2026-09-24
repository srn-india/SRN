import dotenv from 'dotenv';
dotenv.config();
import { prisma } from './src/lib/prisma';
import { supabase } from './src/lib/supabase';

async function run() {
  const email = process.argv[2] || "anshjohnson69@gmail.com";
  console.log(`Processing membership cancellation for: ${email}`);

  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { memberships: true }
  });

  if (!user) {
    console.log(`❌ User with email ${email} not found.`);
    return;
  }

  const activeMemberships = user.memberships.filter(m => m.status === 'ACTIVE');
  if (activeMemberships.length === 0) {
    console.log(`ℹ️ No active memberships found for ${email}. Current status: ${user.memberships.map(m => m.status).join(', ') || 'None'}`);
    return;
  }

  for (const m of activeMemberships) {
    await prisma.membership.update({
      where: { id: m.id },
      data: { status: 'CANCELLED' }
    });
    console.log(`✅ Membership ID ${m.id} status updated to CANCELLED.`);

    // Also clean up ID card asset from Supabase storage
    try {
      const { error: removeErr } = await supabase.storage.from('id-cards').remove([`${m.id}.png`]);
      if (!removeErr) {
        console.log(`🗑️ Removed ID card ${m.id}.png from Supabase storage.`);
      }
    } catch (e) {
      console.warn(`Could not remove storage asset:`, e);
    }
  }

  console.log(`🎉 Successfully removed all membership privileges for ${email}.`);
}

run()
  .catch(err => {
    console.error('Cancellation failed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
