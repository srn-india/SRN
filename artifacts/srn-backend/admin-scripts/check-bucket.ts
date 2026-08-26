import 'dotenv/config';
import { supabase } from '../src/lib/supabase';

async function checkBucket() {
  console.log('--- Checking id-cards Bucket ---');
  const { data, error } = await supabase.storage.from('id-cards').list();
  
  if (error) {
    console.error('Error fetching bucket contents:', error);
    process.exit(1);
  }
  
  if (!data || data.length === 0) {
    console.log('Bucket is empty.');
  } else {
    console.log(`Found ${data.length} items:`);
    data.forEach(item => console.log(`- ${item.name} (${item.metadata?.size} bytes)`));
  }
}

checkBucket();
