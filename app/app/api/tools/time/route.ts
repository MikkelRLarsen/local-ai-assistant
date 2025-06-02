
import { NextRequest, NextResponse } from 'next/server';
import { TimeTool } from '@/tools/time';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timeInfo = TimeTool.getCurrentTime();
    
    return NextResponse.json({
      success: true,
      data: timeInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Time tool error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get current time',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    
    let result;
    
    switch (action) {
      case 'getCurrentTime':
        result = TimeTool.getCurrentTime();
        break;
      case 'getTimezone':
        result = { timezone: TimeTool.getTimezone() };
        break;
      case 'addTime':
        const { amount, unit } = params;
        result = { 
          newTime: TimeTool.addTime(amount, unit),
          formatted: TimeTool.addTime(amount, unit).toLocaleString()
        };
        break;
      case 'formatTime':
        const { timestamp, format } = params;
        result = { 
          formatted: TimeTool.formatTime(timestamp, format)
        };
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
    console.error('Time tool POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process time request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
