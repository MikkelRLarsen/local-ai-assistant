
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { audioData, format = 'webm' } = await request.json();
    
    // Speech-to-Text processing
    // This will integrate with Whisper and Vosk as fallback
    
    // Placeholder implementation
    const transcription = {
      text: "Speech recognition will be implemented here",
      confidence: 0.9,
      language: 'en-US',
      duration: 2.5
    };
    
    return NextResponse.json({
      success: true,
      transcription,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Listen API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Speech recognition failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    supportedFormats: ['webm', 'wav', 'mp3'],
    maxDuration: 300, // 5 minutes
    languages: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE']
  });
}
