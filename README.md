# SupportFlow Lite - ผู้ช่วย AI ตอบแชทอัจฉริยะ

ระบบ AI ช่วยตอบคำถามลูกค้าอัตโนมัติ โดยดึงข้อมูลจาก **Google Sheets** มาใช้เป็นฐานความรู้ (Knowledge Base) ประมวลผลด้วย **Gemini 2.5 Flash** ผ่าน Genkit

[ตัวอย่างหน้าเว็ป](https://support-flow-5zal9lcfz-thanatjir-hubs-projects.vercel.app/)

![ตัวอย่างข้อมูล Google Sheets](https://drive.google.com/uc?export=view&id=1KA_OD3PfU_1SMm18T8eWnEFrvf4QC75V)


## คุณสมบัติเด่น
- **เชื่อมต่อ Google Sheets**: ดึงข้อมูลจากตารางได้แบบ Real-time (ผ่าน CSV Publish)
- **ประมวลผลด้วย AI**: ใช้ Gemini 2.5 Flash ที่มีความเร็วและแม่นยำสูงในการวิเคราะห์คำถาม
- **Webhook API**: รองรับการเชื่อมต่อกับแพลตฟอร์มภายนอก (เช่น LINE, Facebook Messenger) ผ่านทาง HTTP POST
- **หน้า Dashboard**: สำหรับทดสอบการตอบของ AI และดูผลลัพธ์ทันที

## ตัวอย่างโครงสร้างข้อมูลใน Google Sheets
เพื่อให้ AI ทำงานได้อย่างแม่นยำ ควรจัดเรียงข้อมูลให้**มีหัวตารางที่ชัดเจน** ดังตัวอย่างด้านล่างนี้:

![ตัวอย่างข้อมูล Google Sheets](https://drive.google.com/uc?export=view&id=1KA_OD3PfU_1SMm18T8eWnEFrvf4QC75V)


## การติดตั้งและใช้งาน

### 1. เตรียม Google Sheets
- สร้าง Google Sheets และใส่ข้อมูล
- ไปที่ **File > Share > Publish to web**
- เลือกเป็น **Comma-separated values (.csv)** แล้วกด **Publish**
- คัดลองลิงก์ที่ได้มาใส่ในตัวแปร Environment Variable `GOOGLE_SHEET_CSV_URL`

### 2. การตั้งค่า Environment Variables (.env)
หากใช้งานบน Vercel ให้เพิ่มค่าเหล่านี้ในหน้า Settings:
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
  "message": "สมชาย ใจดี ซื้ออะไรไปบ้าง",
  "customer_name": "คุณลูกค้า"
}
```

## เทคโนโลยีที่ใช้
- **Framework**: Next.js 15 (App Router)
- **AI Engine**: Genkit + Google Gemini 2.5 Flash
- **Database**: Firebase Firestore (สำหรับเก็บ Logs)
- **Styling**: Tailwind CSS + ShadCN UI

---
สร้างด้วยความใส่ใจโดย SupportFlow AI Team
