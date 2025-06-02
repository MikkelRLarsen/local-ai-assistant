
// Embedding utilities for document processing
export class EmbeddingService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async generateEmbedding(text: string, model: string = 'nomic-embed-text'): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding || [];
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a mock embedding for development
      return Array.from({ length: 384 }, () => Math.random());
    }
  }

  chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start = end - overlap;
      
      if (start >= text.length) break;
    }

    return chunks;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async searchSimilarChunks(
    queryEmbedding: number[],
    documentChunks: { content: string; embedding: number[] }[],
    limit: number = 5
  ): Promise<{ content: string; score: number }[]> {
    const similarities = documentChunks.map(chunk => ({
      content: chunk.content,
      score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export const embeddingService = new EmbeddingService();

// Export function for backward compatibility
export function generateEmbedding(text: string, model?: string): Promise<number[]> {
  return embeddingService.generateEmbedding(text, model);
}
