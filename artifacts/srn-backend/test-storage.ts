import 'dotenv/config';
import { uploadPaymentReport } from './src/utils/storage.service';

async function test() {
  try {
    const buffer = Buffer.from('test data');
    const url = await uploadPaymentReport('test.xlsx', buffer);
    console.log('Success:', url);
  } catch (error) {
    console.error('Error:', error);
  }
}
test();
