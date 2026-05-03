"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Loader2, RefreshCw, MessageCircleQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export default function TestWebhookForm() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("สมชาย ใจดี ซื้อสินค้าอะไรไปบ้าง?");
  const router = useRouter();

  const examples = [
    "สมชาย ใจดี ซื้อสินค้าอะไรไปบ้าง?",
    "หูฟังบลูทูธราคาเท่าไหร่?",
    "สินค้าหมวดเครื่องใช้ไฟฟ้ามีอะไรบ้าง?",
    "ใครบ้างที่สั่งของจากกรุงเทพฯ?",
    "ขอดูรายการสินค้าของ ปิติ รักชาติ"
  ];

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);

    const form = e?.currentTarget;
    const customerName = form ? (new FormData(form).get('customer_name') as string) : "ผู้เยี่ยมชม";

    const data = {
      message: message,
      customer_name: customerName,
    };

    try {
      const res = await fetch('/api/webhook/supportflow-lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'การส่งคำขอผิดพลาด');
      }
      setResponse(result);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer_name" className="text-xs uppercase font-bold text-muted-foreground">ชื่อผู้ส่ง (Tester Name)</Label>
          <Input 
            id="customer_name" 
            name="customer_name" 
            placeholder="เช่น คุณแอดมิน" 
            className="bg-secondary/20"
            defaultValue="ผู้ใช้งานทดสอบ"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message" className="text-xs uppercase font-bold text-muted-foreground">คำถามถึง AI</Label>
          <Textarea 
            id="message" 
            name="message" 
            placeholder="พิมพ์คำถามที่ต้องการทดสอบ..." 
            className="min-h-[100px] bg-secondary/20"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <MessageCircleQuestion className="w-3 h-3" /> คำถามแนะนำ (อิงตามตาราง Google Sheets)
          </Label>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setMessage(ex)}
                className="text-[10px] px-2 py-1 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-md transition-colors text-primary text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md"
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังวิเคราะห์ข้อมูล...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> ส่งคำถามทดสอบ</>
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {response && (
        <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-primary uppercase flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              คำตอบจาก AI
            </h3>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setResponse(null);
                setError(null);
              }}
            >
              <RefreshCw className="mr-1 h-3 w-3" /> ล้างหน้าจอ
            </Button>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-2">
             <p className="text-sm italic text-foreground">"{response.answer}"</p>
             <div className="flex items-center gap-4 pt-2">
               <div className="text-[10px] text-muted-foreground">
                 หมวดหมู่: <span className="font-bold text-primary uppercase">{
                   response.category === 'faq' ? 'ทั่วไป' :
                   response.category === 'billing' ? 'บิล/การเงิน' :
                   response.category === 'technical' ? 'เทคนิค' :
                   response.category === 'complaint' ? 'ร้องเรียน' : 'อื่นๆ'
                 }</span>
               </div>
               <div className="text-[10px] text-muted-foreground">
                 ความเชื่อมั่น: <span className="font-bold text-accent">{Math.round(response.confidence * 100)}%</span>
               </div>
             </div>
          </div>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-[10px] font-mono leading-relaxed">
            <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1">Raw JSON Payload (ข้อมูลดิบ)</div>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
