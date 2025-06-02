
export class OpenAIClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('OpenAI availability check failed:', error);
      return false;
    }
  }

  async chatCompletion(
    messages: Array<{ role: string; content: string }>,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 2048
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      throw error;
    }
  }

  async evaluatePrompt(prompt: string): Promise<{
    clarity: number;
    specificity: number;
    suggestions: string[];
    score: number;
  }> {
    const evaluationPrompt = `Evaluate this prompt for clarity and specificity on a scale of 0-1:

Prompt: "${prompt}"

Respond with a JSON object containing:
- clarity: number (0-1, how clear and understandable the prompt is)
- specificity: number (0-1, how specific and detailed the prompt is)
- suggestions: array of strings (specific suggestions to improve the prompt)
- score: number (0-1, overall quality score)

Example response:
{
  "clarity": 0.8,
  "specificity": 0.6,
  "suggestions": ["Be more specific about the desired output format", "Add context about the use case"],
  "score": 0.7
}`;

    try {
      const response = await this.chatCompletion([
        { role: 'system', content: 'You are a prompt engineering expert. Evaluate prompts and provide constructive feedback.' },
        { role: 'user', content: evaluationPrompt }
      ], { temperature: 0.3 });

      const evaluation = JSON.parse(response);
      return {
        clarity: evaluation.clarity || 0.5,
        specificity: evaluation.specificity || 0.5,
        suggestions: evaluation.suggestions || [],
        score: evaluation.score || 0.5
      };
    } catch (error) {
      console.error('Prompt evaluation failed:', error);
      return {
        clarity: 0.5,
        specificity: 0.5,
        suggestions: ['Unable to evaluate prompt quality at this time'],
        score: 0.5
      };
    }
  }
}

export const openaiClient = new OpenAIClient();

export function getOpenAIClient(): OpenAIClient {
  return openaiClient;
}
