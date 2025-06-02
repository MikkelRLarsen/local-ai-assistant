# Local AI Assistant v3.0.0 Enhanced

A powerful local AI assistant with enhanced search functionality, featuring multiple search sources, robust fallback systems, and seamless chat integration.

## 🚀 New in v3.0.0 Enhanced

### Enhanced Search Functionality

The Local AI Assistant now features significantly improved search capabilities with:

- **Multiple Search Sources**: Integration with DuckDuckGo, Wikipedia, and Brave Search
- **Robust Cascading Fallback System**: Automatic failover between search providers
- **Enhanced Result Parsing**: Better formatting and presentation of search results
- **Improved Error Handling**: Graceful degradation when search services are unavailable
- **Seamless Chat Integration**: Search results integrated directly into conversation flow

### Search Features

#### Multi-Source Search Engine
- **Primary**: SerpAPI (when configured with API key)
- **Fallback 1**: DuckDuckGo Instant Answer API
- **Fallback 2**: Wikipedia REST API
- **Fallback 3**: Contextual result generation
- **Final Fallback**: Intelligent mock results with search guidance

#### Search Types Supported
- **Web Search**: General web search with comprehensive results
- **News Search**: Latest news and current events
- **Image Search**: Image search with filtering options
- **Contextual Search**: Smart contextual results based on query type

#### Enhanced Reliability
- **Timeout Protection**: 10-second timeout for DuckDuckGo, 8-second for Wikipedia
- **Error Recovery**: Automatic fallback on API failures
- **Result Validation**: Ensures quality results are always returned
- **Performance Monitoring**: Built-in search time tracking

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/thetawavez/local-ai-assistant.git
   cd local-ai-assistant
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   # or
   yarn install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys if available
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## ⚙️ Configuration

### Search Configuration

The search functionality works out of the box with free APIs, but can be enhanced with optional API keys:

#### Optional API Keys
- **SerpAPI**: For enhanced search results (set `SERP_API_KEY` in environment)
- **News API**: For news search functionality
- **Custom Search**: Configure additional search providers

#### Environment Variables
```env
# Optional: Enhanced search with SerpAPI
SERP_API_KEY=your_serpapi_key_here

# Optional: News search
NEWS_API_KEY=your_news_api_key_here

# Optional: Custom search endpoints
CUSTOM_SEARCH_ENDPOINT=your_custom_endpoint
```

### Search Fallback Configuration

The search system automatically cascades through multiple providers:

```
User Query → SerpAPI (if configured) → DuckDuckGo → Wikipedia → Contextual → Mock Results
```

## 🔧 Usage

### Basic Search
The assistant automatically handles search queries in natural conversation:

```
User: "What's the weather like today?"
Assistant: [Provides weather information using integrated search]

User: "Search for the latest news about AI"
Assistant: [Returns current AI news from multiple sources]
```

### Advanced Search Features

#### Contextual Search
The system intelligently recognizes query types:
- **Time queries**: Automatically provides current time/date
- **Weather queries**: Directs to weather tool integration
- **Programming queries**: Provides development resources
- **News queries**: Fetches latest news and events

#### Search Result Enhancement
- **Source Attribution**: Each result shows its source
- **Timestamp Tracking**: Results include retrieval timestamps
- **Relevance Scoring**: Results ordered by relevance
- **Suggestion Generation**: Related search suggestions provided

## 🏗️ Architecture

### Search System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Chat Interface │────│  Search Tool     │────│  Result Parser  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Search Manager  │
                       └──────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │   SerpAPI   │ │ DuckDuckGo  │ │  Wikipedia  │
        └─────────────┘ └─────────────┘ └─────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Contextual Gen.  │
                       └──────────────────┘
```

### Key Components

#### SearchTool Class (`/app/tools/search.ts`)
- **Main Interface**: Primary search functionality
- **API Management**: Handles multiple search providers
- **Fallback Logic**: Implements cascading fallback system
- **Result Processing**: Formats and validates search results

#### Search Types
- **SearchResult Interface**: Standardized result format
- **SearchResponse Interface**: Complete response structure
- **Search Options**: Configurable search parameters

## 🔍 Search API Reference

### SearchTool.search(query, options)

```typescript
interface SearchOptions {
  engine?: 'google' | 'bing' | 'duckduckgo';
  num?: number;
  location?: string;
  language?: string;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  timestamp?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}
```

### Specialized Search Methods

```typescript
// News search
SearchTool.searchNews(query, {
  language?: string;
  country?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
})

// Image search
SearchTool.searchImages(query, {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  type?: 'photo' | 'clipart' | 'lineart';
})
```

## 🚀 Deployment

### Local Deployment
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t local-ai-assistant .
docker run -p 3000:3000 local-ai-assistant
```

### Cloud Deployment
The application can be deployed to:
- Vercel
- Netlify
- AWS
- Google Cloud Platform
- Azure

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 Changelog

### v3.0.0 Enhanced (Current)
- ✨ **New**: Multiple search source integration
- ✨ **New**: Robust cascading fallback system
- ✨ **New**: Enhanced result parsing and formatting
- ✨ **New**: Improved error handling and reliability
- ✨ **New**: Seamless chat interface integration
- ✨ **New**: Contextual search result generation
- ✨ **New**: Performance monitoring and optimization
- 🐛 **Fixed**: Search timeout issues
- 🐛 **Fixed**: Result formatting inconsistencies
- ⚡ **Improved**: Overall search reliability and speed

### Previous Versions
- v2.x.x: Basic search functionality
- v1.x.x: Initial release

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DuckDuckGo for their free search API
- Wikipedia for their comprehensive REST API
- The open-source community for inspiration and support

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/thetawavez/local-ai-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thetawavez/local-ai-assistant/discussions)
- **Documentation**: [Wiki](https://github.com/thetawavez/local-ai-assistant/wiki)

---

**Local AI Assistant v3.0.0 Enhanced** - Bringing powerful, reliable search to your local AI assistant.
