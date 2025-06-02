
import { NextRequest, NextResponse } from 'next/server';
import { IPTool } from '@/tools/ip';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');
    const action = searchParams.get('action') || 'info';
    
    let result;
    
    switch (action) {
      case 'info':
        result = await IPTool.getIPInfo(ip || undefined);
        break;
      case 'public':
        result = { ip: await IPTool.getPublicIP() };
        break;
      case 'local':
        result = { ips: await IPTool.getLocalIPs() };
        break;
      case 'network':
        result = await IPTool.getNetworkInfo();
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
    console.error('IP tool error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get IP information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ip, timeout } = body;
    
    let result;
    
    switch (action) {
      case 'getInfo':
        result = await IPTool.getIPInfo(ip);
        break;
      case 'getPublicIP':
        result = { ip: await IPTool.getPublicIP() };
        break;
      case 'getLocalIPs':
        result = { ips: await IPTool.getLocalIPs() };
        break;
      case 'getNetworkInfo':
        result = await IPTool.getNetworkInfo();
        break;
      case 'checkReachability':
        if (!ip) {
          return NextResponse.json(
            { success: false, error: 'IP address is required for reachability check' },
            { status: 400 }
          );
        }
        result = { 
          ip, 
          reachable: await IPTool.checkIPReachability(ip, timeout || 5000) 
        };
        break;
      case 'validateIP':
        if (!ip) {
          return NextResponse.json(
            { success: false, error: 'IP address is required for validation' },
            { status: 400 }
          );
        }
        result = { 
          ip, 
          valid: IPTool.validateIP(ip),
          isPrivate: IPTool.isPrivateIP(ip)
        };
        break;
      case 'clearCache':
        IPTool.clearCache();
        result = { message: 'Cache cleared successfully' };
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
    console.error('IP tool POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process IP request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
