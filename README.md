# SupportFlow Lite - ผู้ช่วย AI ตอบแชทอัจฉริยะ

ระบบ AI ช่วยตอบคำถามลูกค้าอัตโนมัติ โดยดึงข้อมูลจาก **Google Sheets** มาใช้เป็นฐานความรู้ (Knowledge Base) ประมวลผลด้วย **Gemini 2.5 Flash** ผ่าน Genkit

## คุณสมบัติเด่น
- **เชื่อมต่อ Google Sheets**: ดึงข้อมูลจากตารางได้แบบ Real-time (ผ่าน CSV Publish)
- **ประมวลผลด้วย AI**: ใช้ Gemini 2.5 Flash ที่มีความเร็วและแม่นยำสูงในการวิเคราะห์คำถาม
- **Webhook API**: รองรับการเชื่อมต่อกับแพลตฟอร์มภายนอก (เช่น LINE, Facebook Messenger) ผ่านทาง HTTP POST
- **หน้า Dashboard**: สำหรับทดสอบการตอบของ AI และดูผลลัพธ์ทันที

## การติดตั้งและใช้งาน

### 1. เตรียม Google Sheets
- สร้าง Google Sheets และใส่ข้อมูล (หัวตารางต้องชัดเจน เช่น สินค้า, ราคา, รายละเอียด)
- ไปที่ **File > Share > Publish to web**
- เลือกเป็น **Comma-separated values (.csv)** แล้วกด **Publish**
- คัดลองลิงก์ที่ได้มาใส่ในตัวแปร Environment Variable

### 2. การตั้งค่า Environment Variables (.env)
สร้างไฟล์ `.env` และระบุค่าต่อไปนี้:
```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GOOGLE_SHEET_CSV_URL=your_google_sheet_csv_url
COMPANY_NAME=ชื่อบริษัทของคุณ
COMPANY_INFO=รายละเอียดบริษัทเบื้องต้น
SUPPORT_EMAIL=email@example.com
```

### 3. การใช้งาน Webhook
ส่งคำขอแบบ **POST** ไปที่:
`https://your-domain.com/api/webhook/supportflow-lite`

**JSON Payload ตัวอย่าง:**
```json
{
  "message": "สินค้าหมวดเครื่องใช้ไฟฟ้ามีอะไรบ้าง",
  "customer_name": "คุณลูกค้า"
}
```

## เทคโนโลยีที่ใช้
- **Framework**: Next.js 15 (App Router)
- **AI Engine**: Genkit + Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS + ShadCN UI
- **Deployment**: รองรับ Vercel และ Firebase App Hosting

---
สร้างด้วยความใส่ใจโดย SupportFlow AI Team
