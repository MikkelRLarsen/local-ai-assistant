
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimplePlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SimplePlaceholder({ title, description, icon }: SimplePlaceholderProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="enhanced-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">{description}</p>
          <div className="mt-4 text-sm text-slate-500">
            <p>This feature is coming soon in the enhanced version!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
