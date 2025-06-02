
export interface TimeInfo {
  current: string;
  timezone: string;
  utc: string;
  timestamp: number;
  formatted: {
    date: string;
    time: string;
    full: string;
  };
}

export class TimeTool {
  static getCurrentTime(): TimeInfo {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return {
      current: now.toLocaleString(),
      timezone,
      utc: now.toISOString(),
      timestamp: now.getTime(),
      formatted: {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        full: now.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      }
    };
  }
  
  static formatTime(timestamp: number, format?: string): string {
    const date = new Date(timestamp);
    if (format) {
      // Custom formatting logic can be added here
      return date.toLocaleString();
    }
    return date.toLocaleString();
  }
  
  static getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  static addTime(amount: number, unit: 'minutes' | 'hours' | 'days' | 'weeks'): Date {
    const now = new Date();
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000
    };
    
    return new Date(now.getTime() + (amount * multipliers[unit]));
  }
}

export default TimeTool;
