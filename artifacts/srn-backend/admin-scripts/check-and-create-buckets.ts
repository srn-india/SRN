import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  console.log('Available buckets:', data.map(b => b.name));
  
  // Try to create the id-cards bucket if it doesn't exist
  if (!data.find(b => b.name === 'id-cards')) {
    console.log('Creating id-cards bucket...');
    const { error: createError } = await supabase.storage.createBucket('id-cards', { public: true });
    if (createError) console.error('Error creating id-cards bucket:', createError);
    else console.log('Successfully created id-cards bucket!');
  }
}
checkBuckets();
