
import { NextRequest, NextResponse } from 'next/server';
import { SearchTool } from '@/tools/search';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query');
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    const options = {
      engine: searchParams.get('engine') as 'google' | 'bing' | 'duckduckgo' || 'duckduckgo',
      num: parseInt(searchParams.get('num') || '10'),
      location: searchParams.get('location') || undefined,
      language: searchParams.get('language') || undefined
    };
    
    const results = await SearchTool.search(query, options);
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search tool error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, action = 'search', options = {} } = body;
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'search':
        result = await SearchTool.search(query, options);
        break;
      case 'searchNews':
        result = await SearchTool.searchNews(query, options);
        break;
      case 'searchImages':
        result = await SearchTool.searchImages(query, options);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search tool POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process search request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
