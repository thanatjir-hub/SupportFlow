import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRecentLogs } from '@/lib/db';
import { MessageSquare, ShieldCheck, Mail, Database, Activity, Code, ExternalLink } from 'lucide-react';
import TestWebhookForm from '@/components/test-webhook-form';

export default async function DashboardPage() {
  const logs = await getRecentLogs();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-10">
      {/* Header section */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
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

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Logs */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                ประวัติการตอบโต้ (Logs)
              </h2>
              <p className="text-xs text-muted-foreground italic text-right">ข้อมูลจะอัปเดตอัตโนมัติหลังจากมีการทดสอบ</p>
            </div>
            
            <div className="space-y-4">
              {logs.length === 0 ? (
                <Card className="border-dashed py-12 text-center bg-transparent">
                  <p className="text-muted-foreground">ยังไม่มีประวัติการใช้งานในขณะนี้ ใช้เครื่องมือทดสอบทางขวาเพื่อเริ่มระบบ</p>
                </Card>
              ) : (
                logs.map((log) => (
                  <Card key={log.messageId} className="border-none shadow-sm hover:shadow-md transition-all duration-200 group">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">
                            {log.category === 'faq' ? 'คำถามทั่วไป' : 
                             log.category === 'billing' ? 'การชำระเงิน' : 
                             log.category === 'technical' ? 'เทคนิค' : 
                             log.category === 'complaint' ? 'ร้องเรียน' : 'อื่นๆ'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {log.messageId.slice(0, 8)}
                          </span>
                        </div>
                        <CardTitle className="text-sm font-medium pt-2 group-hover:text-primary transition-colors">
                          "{log.message}"
                        </CardTitle>
                        <CardDescription className="text-xs">
                          จากคุณ <span className="font-semibold text-foreground">{log.customerName}</span> • {new Date(log.receivedAt).toLocaleTimeString('th-TH')}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-accent uppercase">
                          ความแม่นยำ {Math.round(log.confidence * 100)}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="bg-secondary/30 p-4 rounded-lg border border-secondary/50 text-sm leading-relaxed italic relative overflow-hidden">
                        <div className="absolute left-0 top-0 w-1 h-full bg-primary/20" />
                        {log.answer}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right column: API Tester */}
        <div className="space-y-8">
          <section className="sticky top-6 space-y-4">
            <h2 className="text-xl font-headline font-semibold flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              เครื่องมือทดสอบ Webhook
            </h2>
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
  https://your-domain.com/api/webhook/supportflow-lite \\
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
