
'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleChat from '@/components/simple-chat';
import SimplePlaceholder from '@/components/simple-placeholder';
import { 
  MessageSquare, 
  FileText, 
  Code, 
  Activity, 
  Settings,
  BarChart3,
  Zap,
  Brain,
  Mic,
  Users,
  Database,
  Wifi,
  Shield,
  Cpu
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [systemStatus, setSystemStatus] = useState('online');

  useEffect(() => {
    // Simulate system status check
    const checkStatus = () => {
      setSystemStatus('online');
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-effect border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold enhanced-title">
                    AI Assistant v3.0.0
                  </h1>
                  <p className="text-xs text-slate-400">Enhanced Edition</p>
                </div>
              </div>
              <Badge className="version-badge">
                v3.0.0 Enhanced
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="status-indicator">
                <span className="text-sm text-green-400 font-medium">
                  {systemStatus === 'online' ? 'Online Mode' : 'Offline Mode'}
                </span>
              </div>
              <Button variant="outline" size="sm" className="enhanced-button">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold enhanced-title mb-4">
              Welcome to AI Assistant v3.0.0 Enhanced Edition
            </h2>
            <p className="text-lg enhanced-subtitle max-w-3xl mx-auto">
              Experience the next generation of AI assistance with real-time tools, multi-agent support, 
              voice integration, and comprehensive system management capabilities.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="enhanced-card">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-sm">Real-Time Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400">
                  Weather, search, time, and IP tools for current information
                </p>
              </CardContent>
            </Card>

            <Card className="enhanced-card">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-sm">Multi-Agent System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400">
                  Specialized agents for different tasks and domains
                </p>
              </CardContent>
            </Card>

            <Card className="enhanced-card">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-sm">Voice Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400">
                  Speech-to-text and text-to-speech capabilities
                </p>
              </CardContent>
            </Card>

            <Card className="enhanced-card">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-cyan-400" />
                  <CardTitle className="text-sm">Memory Engine</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400">
                  Advanced memory and context management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glass-effect">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Code</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="animate-slide-up">
            <SimpleChat />
          </TabsContent>

          <TabsContent value="documents" className="animate-slide-up">
            <SimplePlaceholder 
              title="Document Manager"
              description="Upload, manage, and search through your documents with AI-powered insights."
              icon={<FileText className="h-5 w-5 text-blue-400" />}
            />
          </TabsContent>

          <TabsContent value="code" className="animate-slide-up">
            <SimplePlaceholder 
              title="Code Executor"
              description="Execute code snippets and get AI assistance with programming tasks."
              icon={<Code className="h-5 w-5 text-green-400" />}
            />
          </TabsContent>

          <TabsContent value="system" className="animate-slide-up">
            <SimplePlaceholder 
              title="System Health Dashboard"
              description="Monitor system performance, resource usage, and application health."
              icon={<Activity className="h-5 w-5 text-purple-400" />}
            />
          </TabsContent>

          <TabsContent value="settings" className="animate-slide-up">
            <SimplePlaceholder 
              title="Settings Panel"
              description="Configure your AI assistant preferences and system settings."
              icon={<Settings className="h-5 w-5 text-cyan-400" />}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-slate-400">
                AI Assistant v3.0.0 Enhanced Edition
              </p>
              <Badge className="enhanced-badge">
                Enterprise Ready
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Wifi className="h-4 w-4 text-green-400" />
                <span>Connected</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
