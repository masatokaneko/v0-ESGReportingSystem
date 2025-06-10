import { createServerSupabaseClient } from '@/lib/supabase'
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
    const supabase = createServerSupabaseClient()
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('esg_entries')
      .select(`
        id,
        date,
        location,
        department,
        activity_type,
        activity_amount,
        emission_factor,
        emission,
        status,
        submitter,
        submitted_at,
        approved_by,
        approved_at,
        notes,
        created_at
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'ESG entry not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // カラム名をキャメルケースに変換
    const transformedData = {
      id: data.id,
      date: data.date,
      location: data.location,
      department: data.department,
      activityType: data.activity_type,
      activityAmount: data.activity_amount,
      emissionFactor: data.emission_factor,
      emission: data.emission,
      status: data.status,
      submitter: data.submitter,
      submittedAt: data.submitted_at,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      notes: data.notes,
      createdAt: data.created_at
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
    const supabase = createServerSupabaseClient()
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateStatusSchema.parse(body)

    let updateData: any = {
      status: validatedData.status,
      updated_at: new Date().toISOString()
    }

    if (validatedData.status === 'approved' && validatedData.approvedBy) {
      updateData.approved_by = validatedData.approvedBy
      updateData.approved_at = new Date().toISOString()
    } else if (validatedData.status === 'pending') {
      updateData.approved_by = null
      updateData.approved_at = null
    }

    const { data, error } = await supabase
      .from('esg_entries')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        date,
        location,
        department,
        activity_type,
        activity_amount,
        emission_factor,
        emission,
        status,
        submitter,
        submitted_at,
        approved_by,
        approved_at,
        notes,
        created_at
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'ESG entry not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // カラム名をキャメルケースに変換
    const transformedData = {
      id: data.id,
      date: data.date,
      location: data.location,
      department: data.department,
      activityType: data.activity_type,
      activityAmount: data.activity_amount,
      emissionFactor: data.emission_factor,
      emission: data.emission,
      status: data.status,
      submitter: data.submitter,
      submittedAt: data.submitted_at,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      notes: data.notes,
      createdAt: data.created_at
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
    const supabase = createServerSupabaseClient()
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('esg_entries')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'ESG entry not found' },
          { status: 404 }
        )
      }
      throw error
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