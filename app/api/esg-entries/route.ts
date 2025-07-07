import { db } from '@/lib/neon'
import { esgEntries, locations } from '@/lib/database.schema'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, gte, lte, and, desc, sql } from 'drizzle-orm'

const ESGEntrySchema = z.object({
  date: z.string(),
  location: z.string(),
  department: z.string(),
  activityType: z.string(),
  activityAmount: z.number().positive(),
  emissionFactor: z.number().positive(),
  submitter: z.string(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const conditions = []

    if (location) {
      // location名でlocation idを検索
      const locationData = await db
        .select({ id: locations.id })
        .from(locations)
        .where(eq(locations.name, location))
        .limit(1)
      
      if (locationData.length > 0) {
        conditions.push(eq(esgEntries.locationId, locationData[0].id))
      }
    }

    if (department) {
      conditions.push(sql`${esgEntries.metadata}->>'department' = ${department}`)
    }

    if (status) {
      conditions.push(sql`${esgEntries.metadata}->>'status' = ${status}`)
    }

    if (startDate) {
      conditions.push(gte(esgEntries.date, new Date(startDate)))
    }

    if (endDate) {
      conditions.push(lte(esgEntries.date, new Date(endDate)))
    }

    const data = await db
      .select({
        id: esgEntries.id,
        date: esgEntries.date,
        locationId: esgEntries.locationId,
        type: esgEntries.type,
        category: esgEntries.category,
        subcategory: esgEntries.subcategory,
        value: esgEntries.value,
        unit: esgEntries.unit,
        emissionFactorId: esgEntries.emissionFactorId,
        calculatedEmissions: esgEntries.calculatedEmissions,
        metadata: esgEntries.metadata,
        createdAt: esgEntries.createdAt,
        updatedAt: esgEntries.updatedAt,
        locationName: locations.name
      })
      .from(esgEntries)
      .leftJoin(locations, eq(esgEntries.locationId, locations.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(esgEntries.date), desc(esgEntries.createdAt))

    // データを期待される形式に変換
    const transformedData = data.map(item => {
      const metadata = item.metadata as any || {}
      return {
        id: item.id,
        date: item.date,
        location: item.locationName || '',
        department: metadata.department || '',
        activityType: item.subcategory,
        activityAmount: Number(item.value),
        emissionFactor: metadata.emissionFactor || 0,
        emission: Number(item.calculatedEmissions || 0),
        status: metadata.status || 'pending',
        submitter: metadata.submitter || '',
        submittedAt: metadata.submittedAt || item.createdAt,
        approvedBy: metadata.approvedBy || null,
        approvedAt: metadata.approvedAt || null,
        notes: metadata.notes || '',
        createdAt: item.createdAt
      }
    })
    
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('ESG entries fetch error:', error)
    
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch ESG entries',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch ESG entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ESGEntrySchema.parse(body)

    // location名からlocation idを取得
    const locationData = await db
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.name, validatedData.location))
      .limit(1)

    if (locationData.length === 0) {
      // locationが存在しない場合は新規作成
      const newLocation = await db
        .insert(locations)
        .values({
          name: validatedData.location,
          region: 'Unknown',
          country: 'Unknown'
        })
        .returning({ id: locations.id })

      locationData.push(newLocation[0])
    }

    const emission = validatedData.activityAmount * validatedData.emissionFactor

    const metadata = {
      department: validatedData.department,
      status: 'pending',
      submitter: validatedData.submitter,
      submittedAt: new Date().toISOString(),
      emissionFactor: validatedData.emissionFactor,
      notes: validatedData.notes || ''
    }

    const [data] = await db
      .insert(esgEntries)
      .values({
        date: new Date(validatedData.date),
        locationId: locationData[0].id,
        type: 'emission',
        category: 'scope1',
        subcategory: validatedData.activityType,
        value: validatedData.activityAmount.toString(),
        unit: 'unit',
        calculatedEmissions: emission.toString(),
        metadata
      })
      .returning()

    // 作成したデータを期待される形式に変換
    const transformedData = {
      id: data.id,
      date: data.date,
      location: validatedData.location,
      department: validatedData.department,
      activityType: data.subcategory,
      activityAmount: Number(data.value),
      emissionFactor: validatedData.emissionFactor,
      emission: Number(data.calculatedEmissions || 0),
      status: 'pending',
      submitter: validatedData.submitter,
      submittedAt: metadata.submittedAt,
      notes: validatedData.notes || '',
      createdAt: data.createdAt
    }

    return NextResponse.json(transformedData, { status: 201 })
  } catch (error) {
    console.error('ESG entry creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      )
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        { 
          error: 'Failed to create ESG entry',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create ESG entry' },
      { status: 500 }
    )
  }
}