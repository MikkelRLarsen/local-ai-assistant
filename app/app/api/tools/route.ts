
import { NextRequest, NextResponse } from 'next/server';
import { TimeTool } from '../../../tools/time';
import { WeatherTool } from '../../../tools/weather';
import { SearchTool } from '../../../tools/search';
import { IPTool } from '../../../tools/ip';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { tool, action, parameters = {} } = await request.json();
    
    if (!tool || !action) {
      return NextResponse.json({
        success: false,
        error: 'Tool and action are required'
      }, { status: 400 });
    }

    let result;

    switch (tool) {
      case 'time':
        if (action === 'current') {
          result = TimeTool.getCurrentTime();
        } else {
          throw new Error(`Unknown time action: ${action}`);
        }
        break;

      case 'weather':
        if (action === 'current') {
          const location = parameters.location || 'New York';
          result = WeatherTool.getMockWeather(location);
        } else {
          throw new Error(`Unknown weather action: ${action}`);
        }
        break;

      case 'search':
        if (action === 'web') {
          const query = parameters.query || parameters.q;
          if (!query) {
            throw new Error('Search query is required');
          }
          result = await SearchTool.search(query);
        } else {
          throw new Error(`Unknown search action: ${action}`);
        }
        break;

      case 'ip':
        if (action === 'info') {
          result = await IPTool.getIPInfo();
        } else {
          throw new Error(`Unknown IP action: ${action}`);
        }
        break;

      default:
        throw new Error(`Unknown tool: ${tool}`);
    }

    return NextResponse.json({
      success: true,
      tool,
      action,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Tools API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Tool execution failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const availableTools = [
    {
      name: 'time',
      description: 'Get current time and date information',
      actions: ['current']
    },
    {
      name: 'weather',
      description: 'Get weather information for any location',
      actions: ['current']
    },
    {
      name: 'search',
      description: 'Search the web for information',
      actions: ['web']
    },
    {
      name: 'ip',
      description: 'Get IP address and location information',
      actions: ['info']
    }
  ];

  return NextResponse.json({
    success: true,
    tools: availableTools,
    timestamp: new Date().toISOString()
  });
}
