import { db } from '@/lib/neon'
import { esgEntries, locations } from '@/lib/database.schema'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'

const UpdateStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  approvedBy: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
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
      .where(eq(esgEntries.id, id))
      .limit(1)

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'ESG entry not found' },
        { status: 404 }
      )
    }

    const item = data[0]
    const metadata = item.metadata as any || {}

    // データを期待される形式に変換
    const transformedData = {
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

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('ESG entry fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ESG entry' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateStatusSchema.parse(body)

    // 既存のデータを取得
    const existingData = await db
      .select({ metadata: esgEntries.metadata })
      .from(esgEntries)
      .where(eq(esgEntries.id, id))
      .limit(1)

    if (existingData.length === 0) {
      return NextResponse.json(
        { error: 'ESG entry not found' },
        { status: 404 }
      )
    }

    const currentMetadata = existingData[0].metadata as any || {}
    const updatedMetadata = {
      ...currentMetadata,
      status: validatedData.status
    }

    if (validatedData.status === 'approved' && validatedData.approvedBy) {
      updatedMetadata.approvedBy = validatedData.approvedBy
      updatedMetadata.approvedAt = new Date().toISOString()
    } else if (validatedData.status === 'pending') {
      delete updatedMetadata.approvedBy
      delete updatedMetadata.approvedAt
    }

    const [updatedEntry] = await db
      .update(esgEntries)
      .set({
        metadata: updatedMetadata,
        updatedAt: new Date()
      })
      .where(eq(esgEntries.id, id))
      .returning()

    // locationを結合して取得
    const data = await db
      .select({
        locationName: locations.name
      })
      .from(locations)
      .where(eq(locations.id, updatedEntry.locationId))
      .limit(1)

    const locationName = data[0]?.locationName || ''

    // データを期待される形式に変換
    const transformedData = {
      id: updatedEntry.id,
      date: updatedEntry.date,
      location: locationName,
      department: updatedMetadata.department || '',
      activityType: updatedEntry.subcategory,
      activityAmount: Number(updatedEntry.value),
      emissionFactor: updatedMetadata.emissionFactor || 0,
      emission: Number(updatedEntry.calculatedEmissions || 0),
      status: updatedMetadata.status,
      submitter: updatedMetadata.submitter || '',
      submittedAt: updatedMetadata.submittedAt || updatedEntry.createdAt,
      approvedBy: updatedMetadata.approvedBy || null,
      approvedAt: updatedMetadata.approvedAt || null,
      notes: updatedMetadata.notes || '',
      createdAt: updatedEntry.createdAt
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('ESG entry update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update ESG entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const deletedRows = await db
      .delete(esgEntries)
      .where(eq(esgEntries.id, id))
      .returning({ id: esgEntries.id })

    if (deletedRows.length === 0) {
      return NextResponse.json(
        { error: 'ESG entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'ESG entry deleted successfully' })
  } catch (error) {
    console.error('ESG entry deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete ESG entry' },
      { status: 500 }
    )
  }
}