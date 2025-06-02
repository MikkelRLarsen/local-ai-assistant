
export interface IPInfo {
  ip: string;
  type: 'IPv4' | 'IPv6';
  location: {
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  isp: string;
  organization: string;
  asn: string;
  security: {
    isProxy: boolean;
    isVpn: boolean;
    isTor: boolean;
    isThreat: boolean;
  };
}

export class IPTool {
  private static cache: Map<string, { data: IPInfo; timestamp: number }> = new Map();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  static async getPublicIP(): Promise<string> {
    try {
      // Try multiple services for reliability
      const services = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://httpbin.org/ip'
      ];
      
      for (const service of services) {
        try {
          const response = await fetch(service);
          if (response.ok) {
            const data = await response.json();
            return data.ip || data.origin;
          }
        } catch (error) {
          console.warn(`IP service ${service} failed:`, error);
          continue;
        }
      }
      
      throw new Error('All IP services failed');
    } catch (error) {
      console.error('Failed to get public IP:', error);
      return 'Unknown';
    }
  }
  
  static async getIPInfo(ip?: string): Promise<IPInfo> {
    const targetIP = ip || await this.getPublicIP();
    
    // Check cache first
    const cached = this.cache.get(targetIP);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    try {
      // Use ipapi.co for detailed IP information
      const response = await fetch(`https://ipapi.co/${targetIP}/json/`);
      
      if (!response.ok) {
        throw new Error(`IP API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const ipInfo: IPInfo = {
        ip: targetIP,
        type: this.detectIPType(targetIP),
        location: {
          country: data.country_name || 'Unknown',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          timezone: data.timezone || 'Unknown'
        },
        isp: data.org || 'Unknown',
        organization: data.org || 'Unknown',
        asn: data.asn || 'Unknown',
        security: {
          isProxy: false, // Would need additional service
          isVpn: false,   // Would need additional service
          isTor: false,   // Would need additional service
          isThreat: false // Would need additional service
        }
      };
      
      // Cache the result
      this.cache.set(targetIP, {
        data: ipInfo,
        timestamp: Date.now()
      });
      
      return ipInfo;
    } catch (error) {
      console.error('Failed to get IP info:', error);
      
      // Return basic info as fallback
      return {
        ip: targetIP,
        type: this.detectIPType(targetIP),
        location: {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          latitude: 0,
          longitude: 0,
          timezone: 'Unknown'
        },
        isp: 'Unknown',
        organization: 'Unknown',
        asn: 'Unknown',
        security: {
          isProxy: false,
          isVpn: false,
          isTor: false,
          isThreat: false
        }
      };
    }
  }
  
  private static detectIPType(ip: string): 'IPv4' | 'IPv6' {
    if (ip.includes(':')) {
      return 'IPv6';
    }
    return 'IPv4';
  }
  
  static async getLocalIPs(): Promise<string[]> {
    // This would work in Node.js environment
    if (typeof window === 'undefined') {
      try {
        const os = require('os');
        const interfaces = os.networkInterfaces();
        const ips: string[] = [];
        
        Object.values(interfaces).forEach((iface: any) => {
          if (iface) {
            iface.forEach((details: any) => {
              if (details.family === 'IPv4' && !details.internal) {
                ips.push(details.address);
              }
            });
          }
        });
        
        return ips;
      } catch (error) {
        console.error('Failed to get local IPs:', error);
      }
    }
    
    // Browser fallback - limited due to security restrictions
    return ['Unable to detect local IPs in browser environment'];
  }
  
  static async checkIPReachability(ip: string, timeout: number = 5000): Promise<boolean> {
    try {
      // In a real implementation, this would use ping or similar
      // For now, we'll use a simple HTTP check if it's a web server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`http://${ip}`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  static validateIP(ip: string): boolean {
    // IPv4 validation
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 validation (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
  
  static isPrivateIP(ip: string): boolean {
    if (!this.validateIP(ip)) {
      return false;
    }
    
    // Check for private IPv4 ranges
    const parts = ip.split('.').map(Number);
    
    if (parts.length === 4) {
      // 10.0.0.0/8
      if (parts[0] === 10) return true;
      
      // 172.16.0.0/12
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      
      // 192.168.0.0/16
      if (parts[0] === 192 && parts[1] === 168) return true;
      
      // 127.0.0.0/8 (loopback)
      if (parts[0] === 127) return true;
    }
    
    return false;
  }
  
  static async getNetworkInfo(): Promise<{
    publicIP: string;
    localIPs: string[];
    ipInfo: IPInfo;
  }> {
    const publicIP = await this.getPublicIP();
    const localIPs = await this.getLocalIPs();
    const ipInfo = await this.getIPInfo(publicIP);
    
    return {
      publicIP,
      localIPs,
      ipInfo
    };
  }
  
  static clearCache(): void {
    this.cache.clear();
  }
}

export default IPTool;
