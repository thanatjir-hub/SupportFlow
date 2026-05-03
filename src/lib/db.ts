import { z } from 'zod';

export const InteractionLogSchema = z.object({
  messageId: z.string(),
  sessionId: z.string(),
  message: z.string(),
  answer: z.string(),
  category: z.string(),
  confidence: z.number(),
  customerName: z.string().optional(),
  receivedAt: z.string(),
  respondedAt: z.string(),
});

export type InteractionLog = z.infer<typeof InteractionLogSchema>;

/**
 * Internal store for prototype (in production this would be Firestore)
 * We start with an empty array so the dashboard shows no logs initially.
 */
let logs: InteractionLog[] = [];

export async function logInteraction(log: InteractionLog) {
  console.log('[LOGGING INTERACTION]:', JSON.stringify(log, null, 2));
  // Add to our temporary store
  logs = [log, ...logs].slice(0, 50);
}

export async function getRecentLogs(): Promise<InteractionLog[]> {
  return logs;
}
