const { Pool } = require('@neondatabase/serverless');

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('🔄 Testing Neon database connection...');
  
  const pool = new Pool({ connectionString });

  try {
    // Test basic connection
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful');

    // Check tables
    const tables = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('locations', 'emission_factors', 'esg_entries')
      ORDER BY tablename;
    `);

    console.log('\n📊 Required tables status:');
    const requiredTables = ['emission_factors', 'esg_entries', 'locations'];
    const existingTables = tables.rows.map(row => row.tablename);
    
    requiredTables.forEach(table => {
      const exists = existingTables.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });

    // Check sample data
    console.log('\n📋 Sample data:');
    
    const locationCount = await pool.query('SELECT COUNT(*) FROM locations');
    console.log(`  Locations: ${locationCount.rows[0].count} records`);
    
    const emissionCount = await pool.query('SELECT COUNT(*) FROM emission_factors');
    console.log(`  Emission factors: ${emissionCount.rows[0].count} records`);
    
    const esgCount = await pool.query('SELECT COUNT(*) FROM esg_entries');
    console.log(`  ESG entries: ${esgCount.rows[0].count} records`);

    console.log('\n🎉 Database setup is complete and ready for use!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testConnection();