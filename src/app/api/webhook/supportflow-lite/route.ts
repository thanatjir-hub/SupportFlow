import { NextRequest, NextResponse } from 'next/server';
import { aiCustomerSupportResponse } from '@/ai/flows/ai-customer-support-response';
import { logInteraction } from '@/lib/db';

export async function POST(req: NextRequest) {
  const receivedAt = new Date().toISOString();
  
  try {
    const body = await req.json();
    const { message, session_id, customer_name } = body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid message. Minimum length is 2 characters." },
        { status: 400 }
      );
    }

    // Use native crypto.randomUUID instead of external uuid library
    const sessionId = session_id || crypto.randomUUID();
    const messageId = crypto.randomUUID();
    const customerName = customer_name || 'Valued Customer';

    // Environment Configuration
    const companyName = process.env.COMPANY_NAME || 'SupportFlow AI';
    const companyInfo = process.env.COMPANY_INFO || 'SupportFlow Lite is an AI-driven support automation tool designed for efficiency and reliability.';
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';

    // AI Processing
    const aiResponse = await aiCustomerSupportResponse({
      message: message.trim(),
      customer_name: customerName,
      company_name: companyName,
      company_info: companyInfo,
      support_email: supportEmail,
    });

    const respondedAt = new Date().toISOString();

    // Logging
    await logInteraction({
      messageId,
      sessionId,
      message: message.trim(),
      answer: aiResponse.answer,
      category: aiResponse.category,
      confidence: aiResponse.confidence,
      customerName: customerName,
      receivedAt,
      respondedAt,
    });

    // Final Response
    return NextResponse.json({
      success: true,
      messageId,
      sessionId,
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      category: aiResponse.category,
      timestamp: respondedAt
    });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
