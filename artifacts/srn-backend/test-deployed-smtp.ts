/**
 * test-deployed-smtp.ts
 *
 * Tests SMTP on the DEPLOYED Render backend via a secret-protected diagnostic endpoint.
 * No user login required — just a shared admin secret.
 *
 * Usage:
 *   npx tsx test-deployed-smtp.ts
 *   npx tsx test-deployed-smtp.ts --to=someother@email.com
 */

import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL  = 'https://srn-backend.onrender.com';
const ADMIN_SECRET = 'srn-admin-test-2026';

const log  = (msg: string) => console.log(`\x1b[36m[TEST]\x1b[0m ${msg}`);
const ok   = (msg: string) => console.log(`\x1b[32m[ OK ]\x1b[0m ${msg}`);
const fail = (msg: string) => console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);

const toArg = process.argv.find(a => a.startsWith('--to='))?.split('=')[1];

async function run() {
  console.log('\n====================================================');
  console.log(' SRN SMTP Diagnostic — Deployed Render Backend');
  console.log('====================================================\n');

  log('Calling /api/admin/test-smtp on deployed backend...');
  log('(Server may take ~30s to wake up from cold start)');

  const url = `${BACKEND_URL}/api/admin/test-smtp${toArg ? `?to=${toArg}` : ''}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { 'X-Admin-Secret': ADMIN_SECRET },
      signal: AbortSignal.timeout(120_000),
    });
  } catch (err: any) {
    fail(`Network error: ${err.message}`);
    fail('Is the Render backend running? Check https://dashboard.render.com');
    process.exit(1);
  }

  const data = await res.json();

  console.log('\n====================================================');
  if (res.ok && data.success) {
    ok(`HTTP ${res.status} — Test email dispatched!`);
    ok(`Sent to: ${data.to}`);
    if (data.info?.messageId) {
      ok(`SMTP Message ID: ${data.info.messageId}`);
    }
    console.log('\n\x1b[32m✅ SMTP is working on the deployed backend!\x1b[0m');
    console.log(`   → Check \x1b[33m${data.to}\x1b[0m inbox (also check Spam/Promotions).\n`);
  } else if (res.status === 403) {
    fail('403 Forbidden — The endpoint is not deployed yet.');
    fail('Push the latest code to GitHub and wait for Render to redeploy, then retry.');
  } else if (res.status === 404) {
    fail('404 Not Found — The /api/admin/test-smtp endpoint does not exist yet.');
    fail('Push the latest code to GitHub and wait for Render to redeploy.');
  } else {
    fail(`HTTP ${res.status} — SMTP failed on the deployed backend!`);
    fail(`Error: ${data.error || data.message}`);
    console.log('\n\x1b[31m❌ SMTP is NOT working. Check Render logs for details:\x1b[0m');
    console.log('   https://dashboard.render.com → srn-backend → Logs\n');
    process.exit(1);
  }
}

run();
