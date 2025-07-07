import { db } from '@/lib/neon'
import { esgEntries } from '@/lib/database.schema'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Check if data already exists
    const existingData = await db.select().from(esgEntries).limit(1)
    
    if (existingData.length > 0) {
      return NextResponse.json({
        message: 'Sample data already exists',
        count: existingData.length
      })
    }

    // Sample ESG entries data
    const sampleEntries = [
      // 東京本社 - 電力データ
      {
        locationId: 1,
        date: new Date('2024-12-01'),
        type: 'emission',
        category: 'scope2',
        subcategory: 'electricity',
        value: '15000',
        unit: 'kWh',
        emissionFactorId: 1,
        calculatedEmissions: (15000 * 0.000433).toString(),
        metadata: {
          department: 'admin',
          submitter: '田中太郎',
          status: 'approved',
          submittedAt: '2024-12-01T09:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-12-01T10:00:00Z',
          emissionFactor: 0.000433,
          notes: '12月度電力使用量'
        }
      },
      {
        locationId: 1,
        date: new Date('2024-11-01'),
        type: 'emission',
        category: 'scope2',
        subcategory: 'electricity',
        value: '14500',
        unit: 'kWh',
        emissionFactorId: 1,
        calculatedEmissions: (14500 * 0.000433).toString(),
        metadata: {
          department: 'admin',
          submitter: '田中太郎',
          status: 'approved',
          submittedAt: '2024-11-01T09:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-11-01T10:00:00Z',
          emissionFactor: 0.000433,
          notes: '11月度電力使用量'
        }
      },
      // 大阪支社 - ガスデータ
      {
        locationId: 2,
        date: new Date('2024-12-01'),
        type: 'emission',
        category: 'scope1',
        subcategory: 'gas',
        value: '800',
        unit: 'm³',
        emissionFactorId: 2,
        calculatedEmissions: (800 * 0.00223).toString(),
        metadata: {
          department: 'sales',
          submitter: '佐藤花子',
          status: 'approved',
          submittedAt: '2024-12-01T11:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-12-01T12:00:00Z',
          emissionFactor: 0.00223,
          notes: '12月度ガス使用量'
        }
      },
      // 福岡支社 - 燃料データ
      {
        locationId: 3,
        date: new Date('2024-12-01'),
        type: 'emission',
        category: 'scope1',
        subcategory: 'fuel',
        value: '500',
        unit: 'L',
        emissionFactorId: 3,
        calculatedEmissions: (500 * 0.00232).toString(),
        metadata: {
          department: 'production',
          submitter: '山田次郎',
          status: 'approved',
          submittedAt: '2024-12-01T14:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-12-01T15:00:00Z',
          emissionFactor: 0.00232,
          notes: '12月度燃料使用量'
        }
      },
      // 東京本社 - 水データ
      {
        locationId: 1,
        date: new Date('2024-12-01'),
        type: 'emission',
        category: 'scope3',
        subcategory: 'water',
        value: '120',
        unit: 'm³',
        emissionFactorId: 4,
        calculatedEmissions: (120 * 0.00036).toString(),
        metadata: {
          department: 'admin',
          submitter: '田中太郎',
          status: 'approved',
          submittedAt: '2024-12-01T16:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-12-01T17:00:00Z',
          emissionFactor: 0.00036,
          notes: '12月度水使用量'
        }
      },
      // 大阪支社 - 廃棄物データ（承認待ち）
      {
        locationId: 2,
        date: new Date('2024-12-01'),
        type: 'emission',
        category: 'scope3',
        subcategory: 'waste',
        value: '200',
        unit: 'kg',
        emissionFactorId: 5,
        calculatedEmissions: (200 * 0.00289).toString(),
        metadata: {
          department: 'sales',
          submitter: '佐藤花子',
          status: 'pending',
          submittedAt: '2024-12-02T09:00:00Z',
          emissionFactor: 0.00289,
          notes: '12月度廃棄物処理量（承認待ち）'
        }
      },
      // 過去数ヶ月のデータ（トレンド表示用）
      {
        locationId: 1,
        date: new Date('2024-10-01'),
        type: 'emission',
        category: 'scope2',
        subcategory: 'electricity',
        value: '13800',
        unit: 'kWh',
        emissionFactorId: 1,
        calculatedEmissions: (13800 * 0.000433).toString(),
        metadata: {
          department: 'admin',
          submitter: '田中太郎',
          status: 'approved',
          submittedAt: '2024-10-01T09:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-10-01T10:00:00Z',
          emissionFactor: 0.000433,
          notes: '10月度電力使用量'
        }
      },
      {
        locationId: 1,
        date: new Date('2024-09-01'),
        type: 'emission',
        category: 'scope2',
        subcategory: 'electricity',
        value: '14200',
        unit: 'kWh',
        emissionFactorId: 1,
        calculatedEmissions: (14200 * 0.000433).toString(),
        metadata: {
          department: 'admin',
          submitter: '田中太郎',
          status: 'approved',
          submittedAt: '2024-09-01T09:00:00Z',
          approvedBy: '管理者',
          approvedAt: '2024-09-01T10:00:00Z',
          emissionFactor: 0.000433,
          notes: '9月度電力使用量'
        }
      }
    ]

    // Insert sample data
    const results = await db.insert(esgEntries).values(sampleEntries).returning()

    return NextResponse.json({
      message: 'Sample data inserted successfully',
      count: results.length,
      entries: results.map(r => ({
        id: r.id,
        subcategory: r.subcategory,
        value: r.value,
        unit: r.unit,
        date: r.date
      }))
    })

  } catch (error) {
    console.error('Sample data insertion error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to insert sample data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}