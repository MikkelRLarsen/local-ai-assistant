
import { NextRequest, NextResponse } from 'next/server';
import { WeatherTool } from '@/tools/weather';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    
    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location parameter is required' },
        { status: 400 }
      );
    }
    
    // Try to get real weather data, fallback to mock data
    let weatherData;
    try {
      weatherData = await WeatherTool.getCurrentWeather(location);
    } catch (error) {
      console.log('Weather API unavailable, using mock data:', error instanceof Error ? error.message : 'Unknown error');
      weatherData = WeatherTool.getMockWeather(location);
    }
    
    return NextResponse.json({
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Weather tool error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, action = 'current', days = 5 } = body;
    
    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'current':
        try {
          result = await WeatherTool.getCurrentWeather(location);
        } catch (error) {
          console.log('Weather API unavailable, using mock data');
          result = WeatherTool.getMockWeather(location);
        }
        break;
      case 'forecast':
        try {
          result = await WeatherTool.getForecast(location, days);
        } catch (error) {
          console.log('Weather forecast API unavailable, using mock data');
          result = WeatherTool.getMockWeather(location).forecast;
        }
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
    console.error('Weather tool POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process weather request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
