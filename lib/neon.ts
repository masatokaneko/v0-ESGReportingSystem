import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import * as schema from './database.schema'

const connectionString = process.env.DATABASE_URL || ''

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable. Please check your environment configuration.')
}

const pool = new Pool({ connectionString })
export const db = drizzle(pool, { schema })

export type Database = typeof db