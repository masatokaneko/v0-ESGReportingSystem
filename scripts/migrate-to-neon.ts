import { supabaseServer } from "../lib/supabase"
import { executeQuery } from "../lib/neon"

// テーブル定義
const tables = ["locations", "departments", "emission_factors", "data_entries", "error_logs"]

// データ移行関数
async function migrateData() {
  console.log("Starting migration from Supabase to Neon...")

  for (const table of tables) {
    try {
      console.log(`Migrating table: ${table}`)

      // Supabaseからデータを取得
      const { data, error } = await supabaseServer.from(table).select("*")

      if (error) {
        console.error(`Error fetching data from ${table}:`, error)
        continue
      }

      if (!data || data.length === 0) {
        console.log(`No data found in table ${table}`)
        continue
      }

      console.log(`Found ${data.length} records in ${table}`)

      // データをバッチで処理
      const batchSize = 100
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize)

        // 各レコードをNeonに挿入
        for (const record of batch) {
          const columns = Object.keys(record).join(", ")
          const placeholders = Object.keys(record)
            .map((_, idx) => `$${idx + 1}`)
            .join(", ")
          const values = Object.values(record)

          const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`

          const result = await executeQuery(query, values)
          if (!result.success) {
            console.error(`Error inserting record into ${table}:`, result.error)
          }
        }

        console.log(`Migrated batch ${i / batchSize + 1} of ${Math.ceil(data.length / batchSize)} for ${table}`)
      }

      console.log(`Successfully migrated table: ${table}`)
    } catch (error) {
      console.error(`Error migrating table ${table}:`, error)
    }
  }

  console.log("Migration completed!")
}

// スクリプト実行
migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error)
    process.exit(1)
  })
