import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

    const { rows } = await sql`
      SELECT 
        id,
        date,
        location,
        department,
        activity_type as "activityType",
        activity_amount as "activityAmount",
        emission_factor as "emissionFactor",
        emission,
        status,
        submitter,
        submitted_at as "submittedAt",
        approved_by as "approvedBy",
        approved_at as "approvedAt",
        notes,
        created_at as "createdAt"
      FROM esg_entries
      WHERE id = ${id}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'ESG entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
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

    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    updateFields.push(`status = $${paramIndex}`)
    updateValues.push(validatedData.status)
    paramIndex++

    if (validatedData.status === 'approved' && validatedData.approvedBy) {
      updateFields.push(`approved_by = $${paramIndex}`)
      updateValues.push(validatedData.approvedBy)
      paramIndex++
      
      updateFields.push(`approved_at = CURRENT_TIMESTAMP`)
    } else if (validatedData.status === 'pending') {
      updateFields.push(`approved_by = NULL`)
      updateFields.push(`approved_at = NULL`)
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

    const query = `
      UPDATE esg_entries 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        date,
        location,
        department,
        activity_type as "activityType",
        activity_amount as "activityAmount",
        emission_factor as "emissionFactor",
        emission,
        status,
        submitter,
        submitted_at as "submittedAt",
        approved_by as "approvedBy",
        approved_at as "approvedAt",
        notes,
        created_at as "createdAt"
    `

    updateValues.push(id)

    const { rows } = await sql.query(query, updateValues)

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'ESG entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
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

    const { rowCount } = await sql`
      DELETE FROM esg_entries WHERE id = ${id}
    `

    if (rowCount === 0) {
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