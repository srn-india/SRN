const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.cgmlrhewmemptyklkbrq:az0ymF43qDgttf1E@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true'
});

async function main() {
  try {
    const res = await pool.query(`UPDATE "PostApplication" SET "userId" = (SELECT id FROM "User" WHERE email = 'anshjohnson69@gmail.com') WHERE email = 'anshjohnson69@gmail.com' AND "userId" IS NULL`);
    console.log('Updated rows:', res.rowCount);
    
    // Also let's check if the user has any application now
    const check = await pool.query(`SELECT id, status, "userId" FROM "PostApplication" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'anshjohnson69@gmail.com')`);
    console.log('Applications for user:', check.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
main();
