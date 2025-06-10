import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('locations')
      .select(`
        id,
        name,
        code,
        address,
        type,
        created_at
      `)
      .order('name')

    if (error) {
      throw error
    }

    // カラム名をキャメルケースに変換
    const transformedData = data?.map(item => ({
      id: item.id,
      name: item.name,
      code: item.code,
      address: item.address,
      type: item.type,
      createdAt: item.created_at
    })) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Locations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}