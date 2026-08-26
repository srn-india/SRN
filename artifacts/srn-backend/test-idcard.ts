import 'dotenv/config';
import { generateAndUploadIdCard } from './src/modules/membership/idcard.service';

async function test() {
  const url = await generateAndUploadIdCard('617fbc23-19e3-44bf-bb3b-b67018f3788c');
  console.log('Result:', url);
}
test();
