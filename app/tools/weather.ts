
export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  description: string;
  precipitation: number;
}

export class WeatherTool {
  private static apiKey: string | null = null;
  private static baseUrl = 'https://api.openweathermap.org/data/2.5';
  
  static setApiKey(key: string) {
    this.apiKey = key;
  }
  
  static async getCurrentWeather(location: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key not configured');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // Would need separate UV API call
        forecast: [] // Would need forecast API call
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw error;
    }
  }
  
  static async getForecast(location: string, days: number = 5): Promise<WeatherForecast[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key not configured');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Group by day and get daily highs/lows
      const dailyForecasts: WeatherForecast[] = [];
      const groupedByDay: { [key: string]: any[] } = {};
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(item);
      });
      
      Object.entries(groupedByDay).forEach(([date, items]) => {
        const temps = items.map(item => item.main.temp);
        const high = Math.round(Math.max(...temps));
        const low = Math.round(Math.min(...temps));
        const description = items[0].weather[0].description;
        const precipitation = items.reduce((sum, item) => sum + (item.rain?.['3h'] || 0), 0);
        
        dailyForecasts.push({
          date,
          high,
          low,
          description,
          precipitation
        });
      });
      
      return dailyForecasts.slice(0, days);
    } catch (error) {
      console.error('Forecast fetch error:', error);
      throw error;
    }
  }
  
  // Fallback method for when API is not available
  static getMockWeather(location: string): WeatherData {
    return {
      location,
      temperature: 22,
      description: 'Partly cloudy',
      humidity: 65,
      windSpeed: 5.2,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      forecast: [
        {
          date: new Date().toDateString(),
          high: 25,
          low: 18,
          description: 'Sunny',
          precipitation: 0
        }
      ]
    };
  }
}

export default WeatherTool;
