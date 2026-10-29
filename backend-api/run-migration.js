#!/usr/bin/env node
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || '103.134.221.200',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || '9c66f3bdce2fc90461a2f510628f3daa'),
    database: process.env.DB_NAME || 'postgres',
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    const migrationPath = path.join(__dirname, 'migrations', '001_rbac_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Running migration 001_rbac_schema.sql...');
    await client.query(sql);
    console.log('✅ Migration completed successfully');

    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'wargaku_%'
      ORDER BY table_name
    `);
    
    console.log(`\n📊 Total tables created: ${tableCheck.rows.length}`);
    tableCheck.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔒 Database connection closed');
  }
}

runMigration();
