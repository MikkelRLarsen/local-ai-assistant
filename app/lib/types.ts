
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: any;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Document {
  id: string;
  filename: string;
  content: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  processed: boolean;
}

export interface CodeExecution {
  id: string;
  language: string;
  code: string;
  output?: string;
  error?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Settings {
  id: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  preferences?: any;
}

export interface OllamaModel {
  name: string;
  size: string;
  digest: string;
  modified_at: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  model?: string;
  temperature?: number;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  messageId: string;
}

export interface DocumentQueryRequest {
  query: string;
  documentIds?: string[];
  limit?: number;
}

export interface DocumentQueryResponse {
  results: {
    content: string;
    filename: string;
    score: number;
  }[];
}

export interface CodeExecutionRequest {
  code: string;
  language: string;
}

export interface CodeExecutionResponse {
  id: string;
  output?: string;
  error?: string;
  status: string;
}
