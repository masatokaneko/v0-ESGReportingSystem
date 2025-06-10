import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const currentDate = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('emission_factors')
      .select(`
        id,
        activity_type,
        category,
        factor,
        unit,
        valid_from,
        valid_to,
        created_at
      `)
      .or(`valid_to.is.null,valid_to.gte.${currentDate}`)
      .order('activity_type')
      .order('category')

    if (error) {
      throw error
    }

    // カラム名をキャメルケースに変換
    const transformedData = data?.map(item => ({
      id: item.id,
      activityType: item.activity_type,
      category: item.category,
      factor: item.factor,
      unit: item.unit,
      validFrom: item.valid_from,
      validTo: item.valid_to,
      createdAt: item.created_at
    })) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Emission factors fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emission factors' },
      { status: 500 }
    )
  }
}