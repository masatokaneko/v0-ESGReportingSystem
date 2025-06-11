import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
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

    if (location) {
      query = query.eq('location', location)
    }

    if (department) {
      query = query.eq('department', department)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query.order('date', { ascending: false }).order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }

    // カラム名をキャメルケースに変換
    const transformedData = data?.map(item => ({
      id: item.id,
      date: item.date,
      location: item.location,
      department: item.department,
      activityType: item.activity_type,
      activityAmount: item.activity_amount,
      emissionFactor: item.emission_factor,
      emission: item.emission,
      status: item.status,
      submitter: item.submitter,
      submittedAt: item.submitted_at,
      approvedBy: item.approved_by,
      approvedAt: item.approved_at,
      notes: item.notes,
      createdAt: item.created_at
    })) || []
    
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('ESG entries fetch error:', error)
    
    // Supabaseエラーの詳細を返す
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch ESG entries',
          details: error.message,
          code: 'code' in error ? error.code : undefined
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
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const validatedData = ESGEntrySchema.parse(body)

    const emission = validatedData.activityAmount * validatedData.emissionFactor

    const { data, error } = await supabase
      .from('esg_entries')
      .insert({
        date: validatedData.date,
        location: validatedData.location,
        department: validatedData.department,
        activity_type: validatedData.activityType,
        activity_amount: validatedData.activityAmount,
        emission_factor: validatedData.emissionFactor,
        emission,
        status: 'pending',
        submitter: validatedData.submitter,
        notes: validatedData.notes || null
      })
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
        notes,
        created_at
      `)
      .single()

    if (error) {
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
      notes: data.notes,
      createdAt: data.created_at
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

    // Supabaseエラーの詳細を返す
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        { 
          error: 'Failed to create ESG entry',
          details: error.message,
          code: 'code' in error ? error.code : undefined
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