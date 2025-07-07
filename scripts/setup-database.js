const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Please check your .env.local file.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('Connecting to Neon database...');
    
    // Read SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, '..', 'neon-schema.sql'), 'utf8');
    
    // Split SQL commands by semicolon
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    console.log(`Found ${commands.length} SQL commands to execute`);

    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';';
      console.log(`Executing command ${i + 1}/${commands.length}...`);
      
      try {
        await pool.query(command);
      } catch (error) {
        console.error(`Error executing command ${i + 1}:`, error.message);
        // Continue with other commands
      }
    }

    console.log('Database setup completed successfully!');
    
    // Verify tables
    const result = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    console.log('\nCreated tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.tablename}`);
    });

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

setupDatabase();