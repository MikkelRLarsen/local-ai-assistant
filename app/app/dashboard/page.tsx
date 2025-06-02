
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Database, 
  Mic, 
  Users, 
  Zap, 
  Settings, 
  FileText,
  Search,
  Calculator,
  Clock,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Home,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SystemStats {
  agents: {
    total: number;
    active: number;
    idle: number;
    error: number;
  };
  memory: {
    totalMemories: number;
    typeDistribution: Record<string, number>;
    cacheSize: number;
  };
  rag: {
    totalDocuments: number;
    totalChunks: number;
    typeDistribution: Record<string, number>;
  };
  tools: {
    available: number;
    mostUsed: string[];
  };
  voice: {
    isSupported: boolean;
    isRecording: boolean;
    engine: string;
  };
  plugins: {
    loaded: number;
    enabled: number;
    errors: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const mockStats: SystemStats = {
        agents: {
          total: 3,
          active: 1,
          idle: 2,
          error: 0
        },
        memory: {
          totalMemories: 156,
          typeDistribution: {
            conversation: 89,
            fact: 34,
            preference: 23,
            context: 10
          },
          cacheSize: 156
        },
        rag: {
          totalDocuments: 12,
          totalChunks: 48,
          typeDistribution: {
            pdf: 5,
            markdown: 4,
            text: 2,
            url: 1
          }
        },
        tools: {
          available: 9,
          mostUsed: ['time', 'calculator', 'search', 'weather']
        },
        voice: {
          isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
          isRecording: false,
          engine: 'browser'
        },
        plugins: {
          loaded: 2,
          enabled: 2,
          errors: 0
        }
      };

      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  const handleVoiceTest = async () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => setIsRecording(false), 3000);
    }
  };

  const handleSpeechTest = async () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    } else {
      setIsSpeaking(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Voice integration is working correctly.');
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-background/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-bold text-xl gradient-text-enhanced">AI Assistant Dashboard</span>
                <div className="text-xs text-slate-400">v3.0.0 Enhanced</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400/30">
              System Healthy
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 heading-enhanced">System Dashboard</h1>
          <p className="text-slate-400">
            Comprehensive monitoring and management interface for AI Assistant v3.0.0 Enhanced
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">Overview</TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300">Agents</TabsTrigger>
            <TabsTrigger value="memory" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-300">Memory</TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-300">Voice</TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-300">Tools</TabsTrigger>
            <TabsTrigger value="plugins" className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-300">Plugins</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Active Agents</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.agents.active || 0}</div>
                  <p className="text-xs text-slate-400">
                    {stats?.agents.total || 0} total agents available
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Memory Items</CardTitle>
                  <Brain className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.memory.totalMemories || 0}</div>
                  <p className="text-xs text-slate-400">
                    Across {Object.keys(stats?.memory.typeDistribution || {}).length} categories
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Documents</CardTitle>
                  <FileText className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.rag.totalDocuments || 0}</div>
                  <p className="text-xs text-slate-400">
                    {stats?.rag.totalChunks || 0} chunks indexed
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-yellow-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Real-time Tools</CardTitle>
                  <Zap className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.tools.available || 0}</div>
                  <p className="text-xs text-slate-400">
                    Ready for use
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-slate-500/20">
                <CardHeader>
                  <CardTitle className="text-white">System Performance</CardTitle>
                  <CardDescription className="text-slate-400">Overall system health metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Agent Performance</span>
                      <span className="text-green-400">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Memory Efficiency</span>
                      <span className="text-blue-400">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Response Time</span>
                      <span className="text-purple-400">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Tool Availability</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-slate-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">Latest system events and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300">Agent task completed successfully</span>
                      <span className="text-xs text-slate-500 ml-auto">2m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-300">New memory stored</span>
                      <span className="text-xs text-slate-500 ml-auto">5m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-slate-300">Voice command processed</span>
                      <span className="text-xs text-slate-500 ml-auto">8m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-slate-300">Document indexed</span>
                      <span className="text-xs text-slate-500 ml-auto">12m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-slate-300">Real-time tool executed</span>
                      <span className="text-xs text-slate-500 ml-auto">15m ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card className="glass-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Agent Management</CardTitle>
                <CardDescription className="text-slate-400">Monitor and manage AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                    <div className="text-2xl font-bold text-green-400">{stats?.agents.active}</div>
                    <div className="text-sm text-slate-300">Active</div>
                  </div>
                  <div className="text-center p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                    <div className="text-2xl font-bold text-blue-400">{stats?.agents.idle}</div>
                    <div className="text-sm text-slate-300">Idle</div>
                  </div>
                  <div className="text-center p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                    <div className="text-2xl font-bold text-red-400">{stats?.agents.error}</div>
                    <div className="text-sm text-slate-300">Error</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium text-white">General Assistant Agent</div>
                        <div className="text-sm text-slate-400">Handling general queries and conversations</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-600/20 text-green-300">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-white">Code Assistant Agent</div>
                        <div className="text-sm text-slate-400">Ready for programming and development tasks</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">Idle</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-white">Research Agent</div>
                        <div className="text-sm text-slate-400">Available for research and analysis tasks</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">Idle</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="space-y-6">
            <Card className="glass-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white">Memory Engine</CardTitle>
                <CardDescription className="text-slate-400">Long-term memory and context management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Object.entries(stats?.memory.typeDistribution || {}).map(([type, count]) => (
                    <div key={type} className="text-center p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                      <div className="text-2xl font-bold text-white">{count}</div>
                      <div className="text-sm text-slate-400 capitalize">{type}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Memory Utilization</span>
                    <span className="text-green-400">78%</span>
                  </div>
                  <Progress value={78} />

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Cache Hit Rate</span>
                    <span className="text-blue-400">94%</span>
                  </div>
                  <Progress value={94} />

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Consolidation Progress</span>
                    <span className="text-purple-400">100%</span>
                  </div>
                  <Progress value={100} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card className="glass-card border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white">Voice Integration</CardTitle>
                <CardDescription className="text-slate-400">Speech-to-text and text-to-speech capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Speech Recognition</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stats?.voice.isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-slate-300">
                        {stats?.voice.isSupported ? 'Supported' : 'Not Supported'}
                      </span>
                    </div>
                    <Button 
                      onClick={handleVoiceTest}
                      disabled={!stats?.voice.isSupported}
                      className="w-full bg-orange-600/20 border border-orange-500/30 text-orange-300 hover:bg-orange-600/30"
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Test Microphone
                        </>
                      )}
                    </Button>
                    {isRecording && (
                      <div className="flex items-center space-x-2 text-sm text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Recording...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Speech Synthesis</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stats?.voice.isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-slate-300">
                        {stats?.voice.isSupported ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <Button 
                      onClick={handleSpeechTest}
                      disabled={!stats?.voice.isSupported}
                      className="w-full bg-orange-600/20 border border-orange-500/30 text-orange-300 hover:bg-orange-600/30"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2" />
                          Stop Speaking
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Test Speakers
                        </>
                      )}
                    </Button>
                    {isSpeaking && (
                      <div className="flex items-center space-x-2 text-sm text-blue-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Speaking...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-4">
                  <h3 className="text-lg font-medium mb-4 text-white">Voice Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">STT Engine</label>
                      <div className="text-sm text-slate-400">{stats?.voice.engine}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">TTS Engine</label>
                      <div className="text-sm text-slate-400">Browser</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Language</label>
                      <div className="text-sm text-slate-400">en-US</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card className="glass-card border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white">Real-time Tools</CardTitle>
                <CardDescription className="text-slate-400">Available tools and usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  <div className="flex flex-col items-center p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                    <Clock className="w-8 h-8 mb-2 text-blue-400" />
                    <span className="text-sm font-medium text-white">Time</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                    <Calculator className="w-8 h-8 mb-2 text-green-400" />
                    <span className="text-sm font-medium text-white">Calculator</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-purple-500/20 rounded-lg bg-purple-500/5">
                    <Search className="w-8 h-8 mb-2 text-purple-400" />
                    <span className="text-sm font-medium text-white">Search</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-orange-500/20 rounded-lg bg-orange-500/5">
                    <Wifi className="w-8 h-8 mb-2 text-orange-400" />
                    <span className="text-sm font-medium text-white">Weather</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                    <FileText className="w-8 h-8 mb-2 text-red-400" />
                    <span className="text-sm font-medium text-white">File</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Most Used Tools</h3>
                  <div className="space-y-2">
                    {stats?.tools.mostUsed.map((tool, index) => (
                      <div key={tool} className="flex items-center justify-between p-3 border border-slate-700/50 rounded-lg bg-slate-800/30">
                        <span className="font-medium capitalize text-white">{tool}</span>
                        <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300">
                          {Math.floor(Math.random() * 100) + 50} uses
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plugins" className="space-y-6">
            <Card className="glass-card border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white">Plugin Management</CardTitle>
                <CardDescription className="text-slate-400">Installed plugins and extensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                    <div className="text-2xl font-bold text-green-400">{stats?.plugins.loaded}</div>
                    <div className="text-sm text-slate-300">Loaded</div>
                  </div>
                  <div className="text-center p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                    <div className="text-2xl font-bold text-blue-400">{stats?.plugins.enabled}</div>
                    <div className="text-sm text-slate-300">Enabled</div>
                  </div>
                  <div className="text-center p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                    <div className="text-2xl font-bold text-red-400">{stats?.plugins.errors}</div>
                    <div className="text-sm text-slate-300">Errors</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                    <div>
                      <div className="font-medium text-white">Core Tools Plugin</div>
                      <div className="text-sm text-slate-400">Essential system tools and utilities</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-600/20 text-green-300">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                    <div>
                      <div className="font-medium text-white">Voice Integration Plugin</div>
                      <div className="text-sm text-slate-400">Speech recognition and synthesis capabilities</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-600/20 text-green-300">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30">
                    <div>
                      <div className="font-medium text-white">Example Plugin</div>
                      <div className="text-sm text-slate-400">Plugin development template and example</div>
                    </div>
                    <Badge variant="outline" className="border-slate-400/30 text-slate-400">Disabled</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Plugins
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
