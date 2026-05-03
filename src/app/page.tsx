import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Activity, Code } from 'lucide-react';
import TestWebhookForm from '@/components/test-webhook-form';

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-10">
      {/* Header section */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-accent" />
            SupportFlow Lite
          </h1>
          <p className="text-muted-foreground mt-1">ระบบจัดการผู้ช่วย AI ตอบแชทลูกค้าอัจฉริยะ</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-white shadow-sm">
            <Activity className="w-3 h-3 mr-1 text-green-500" /> Webhook: ออนไลน์
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-white shadow-sm font-mono">
            Gemini 2.5 Flash
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-headline font-semibold">
                เครื่องมือทดสอบ Webhook
              </h2>
            </div>
            
            <Card className="border-none shadow-xl bg-white overflow-hidden ring-1 ring-black/5">
              <CardHeader className="bg-primary text-primary-foreground pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent text-accent-foreground border-none">POST</Badge>
                  <span className="text-[10px] opacity-70 font-mono">/api/webhook/supportflow-lite</span>
                </div>
                <CardTitle className="text-lg">ทดลองส่งคำถาม</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  ใส่ข้อความเพื่อดูว่า AI ใช้ข้อมูลจาก Google Sheet ตอบอย่างไร
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TestWebhookForm />
              </CardContent>
            </Card>
            
            <div className="bg-white p-6 rounded-xl border border-dashed text-xs space-y-3 shadow-sm">
              <p className="font-semibold text-primary flex items-center gap-2">
                <Code className="w-3 h-3" /> ตัวอย่างโค้ดเชื่อมต่อภายนอก (cURL)
              </p>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-[10px] text-muted-foreground">
{`curl -X POST \\
  https://your-domain.vercel.app/api/webhook/supportflow-lite \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "ติดต่อสอบถามเรื่องอะไรได้บ้าง",
    "customer_name": "คุณลูกค้า"
  }'`}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
