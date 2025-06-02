
export interface ApiKeyData {
  id?: string;
  provider: string;
  keyName: string;
  apiKey?: string;
  isActive?: boolean;
  testStatus?: string;
  lastTested?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemStatus {
  timestamp: string;
  uptime: number;
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    cpuCount: number;
  };
  memory: {
    process: any;
    system: any;
    usage: {
      percentage: string;
    };
  };
  services: {
    ollama: {
      status: string;
      models: any[];
      modelCount: number;
    };
    database: {
      status: string;
    };
    websocket: {
      activeConnections: number;
    };
  };
  apiKeys: Record<string, any>;
  recentActivity: {
    apiCalls: any[];
  };
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // API Keys
  async getApiKeys(): Promise<{ apiKeys: ApiKeyData[] }> {
    return this.request('/api-keys');
  }

  async createApiKey(data: ApiKeyData): Promise<{ apiKey: ApiKeyData; message: string }> {
    return this.request('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApiKey(id: string, data: Partial<ApiKeyData>): Promise<{ apiKey: ApiKeyData; message: string }> {
    return this.request('/api-keys', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    });
  }

  async deleteApiKey(id: string): Promise<{ message: string }> {
    return this.request(`/api-keys?id=${id}`, {
      method: 'DELETE',
    });
  }

  async testApiKey(provider: string, apiKey?: string, id?: string): Promise<any> {
    return this.request('/api-keys/test', {
      method: 'POST',
      body: JSON.stringify({ provider, apiKey, id }),
    });
  }

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    return this.request('/system/status');
  }

  async getSystemLogs(params?: {
    level?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.level) searchParams.set('level', params.level);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    return this.request(`/system/logs?${searchParams.toString()}`);
  }

  async createSystemLog(data: {
    level: string;
    category: string;
    message: string;
    metadata?: any;
  }): Promise<any> {
    return this.request('/system/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Vector Search
  async vectorSearch(data: {
    query: string;
    sourceType?: string;
    limit?: number;
    threshold?: number;
  }): Promise<any> {
    return this.request('/vector/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createEmbedding(data: {
    content: string;
    sourceType: string;
    sourceId: string;
    metadata?: any;
  }): Promise<any> {
    return this.request('/vector/embed', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmbeddings(params?: {
    sourceType?: string;
    sourceId?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.sourceType) searchParams.set('sourceType', params.sourceType);
    if (params?.sourceId) searchParams.set('sourceId', params.sourceId);

    return this.request(`/vector/embed?${searchParams.toString()}`);
  }

  // Conversations
  async generateConversationSummary(conversationId: string): Promise<any> {
    return this.request('/conversations/summary', {
      method: 'POST',
      body: JSON.stringify({ conversationId }),
    });
  }

  async getConversationSummary(conversationId: string): Promise<any> {
    return this.request(`/conversations/summary?conversationId=${conversationId}`);
  }

  // WebSocket Info
  async getWebSocketInfo(): Promise<{ websocketUrl: string; status: string; timestamp: string }> {
    return this.request('/websocket');
  }
}

// Global API client instance
let globalApiClient: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!globalApiClient) {
    globalApiClient = new ApiClient();
  }
  return globalApiClient;
}

export { ApiClient };
