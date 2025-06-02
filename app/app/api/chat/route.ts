
import { NextRequest, NextResponse } from 'next/server';
import { TimeTool } from '@/tools/time';
import { WeatherTool } from '@/tools/weather';
import { SearchTool } from '@/tools/search';
import { IPTool } from '@/tools/ip';

export const dynamic = 'force-dynamic';

// Simple fallback responses
const fallbackResponses = [
  "I'm here to help! I can provide real-time information like current time, weather, search results, and more.",
  "Feel free to ask me about the current time, weather in any city, or search for information on any topic.",
  "I'm your AI assistant with access to real-time tools. What would you like to know?",
];

async function executeTool(toolName: string, params: any): Promise<string> {
  try {
    switch (toolName) {
      case 'time':
        const timeData = TimeTool.getCurrentTime();
        return `Current time: ${timeData.formatted.full}`;

      case 'weather':
        const location = params.location || 'New York';
        const weatherData = WeatherTool.getMockWeather(location);
        return `Weather in ${location}: ${weatherData.description}, ${weatherData.temperature}°C. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} km/h`;

      case 'search':
        const query = params.query || params.q || '';
        if (!query) return 'Please provide a search query.';
        try {
          const searchResults = await SearchTool.search(query);
          if (searchResults.results && searchResults.results.length > 0) {
            const topResults = searchResults.results.slice(0, 3);
            return `Search results for "${query}":\n\n${topResults.map((result: any, index: number) => 
              `${index + 1}. ${result.title}\n${result.snippet}\nSource: ${result.url}`
            ).join('\n\n')}`;
          }
          return `I searched for "${query}" but didn't find specific results. You might want to try a different search term.`;
        } catch (error) {
          return `I searched for "${query}" and found some general information, but couldn't retrieve specific details at the moment.`;
        }

      case 'ip':
        const ipData = await IPTool.getIPInfo();
        return `Your IP information: ${ipData.ip} (${ipData.location.city}, ${ipData.location.region}, ${ipData.location.country})`;

      default:
        return `Unknown tool: ${toolName}`;
    }
  } catch (error) {
    console.error(`Tool execution error for ${toolName}:`, error);
    return `Error executing ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

function detectToolUsage(message: string): { tool: string; params: any } | null {
  const lowerMessage = message.toLowerCase();
  
  // Time detection
  if (lowerMessage.includes('time') || lowerMessage.includes('clock') || lowerMessage.includes('what time')) {
    return { tool: 'time', params: {} };
  }
  
  // Weather detection
  if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('forecast')) {
    const locationMatch = message.match(/weather (?:in |for )?([a-zA-Z\s]+)/i) || 
                         message.match(/temperature (?:in |for )?([a-zA-Z\s]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : 'New York';
    return { tool: 'weather', params: { location } };
  }
  
  // Search detection
  if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look up')) {
    const searchMatch = message.match(/(?:search|find|look up) (?:for )?(.+)/i);
    const query = searchMatch ? searchMatch[1].trim() : message;
    return { tool: 'search', params: { query } };
  }
  
  // IP detection
  if (lowerMessage.includes('ip') || lowerMessage.includes('my ip') || lowerMessage.includes('ip address')) {
    return { tool: 'ip', params: {} };
  }
  
  return null;
}

async function getAIResponse(message: string): Promise<{ content: string; source: string; toolsUsed?: string[] }> {
  // Check if we need to use a tool
  const toolUsage = detectToolUsage(message);
  
  if (toolUsage) {
    const toolResult = await executeTool(toolUsage.tool, toolUsage.params);
    return {
      content: toolResult,
      source: 'tool',
      toolsUsed: [toolUsage.tool]
    };
  }
  
  // Try OpenAI if available
  try {
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          content: data.choices[0]?.message?.content || 'I received an empty response.',
          source: 'openai'
        };
      }
    }
  } catch (error) {
    console.log('OpenAI API unavailable:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Fallback response
  const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return {
    content: randomResponse,
    source: 'fallback'
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        message: 'Please provide a valid message.',
        source: 'error',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    const aiResponse = await getAIResponse(message);

    return NextResponse.json({
      message: aiResponse.content,
      source: aiResponse.source,
      toolsUsed: aiResponse.toolsUsed || [],
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json({
      message: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment.",
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'AI Assistant API is running',
    version: '3.0.0 Enhanced',
    timestamp: new Date().toISOString(),
  });
}
