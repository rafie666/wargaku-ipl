const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const client = new Client({
    host: '103.134.221.200',
    port: 5432,
    user: 'postgres',
    password: '9c66f3bdce2fc90461a2f510628f3daa',
    database: 'postgres',
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected');

    const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_rbac_schema.sql'), 'utf-8');
    console.log('Running migration...');
    await client.query(sql);
    console.log('✅ Migration completed');

    const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'wargaku_%' ORDER BY table_name");
    console.log(`\n📊 Tables (${result.rows.length}):`);
    result.rows.forEach(r => console.log('  -', r.table_name));
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
