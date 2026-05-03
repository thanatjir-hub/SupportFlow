# **App Name**: SupportFlow AI Assistant

## Core Features:

- Webhook API Endpoint: Handles incoming customer support requests via a POST /supportflow-lite webhook.
- Input Validation & Session Management: Validates incoming messages, trims text, generates session/message IDs and timestamps, and ensures message length requirements for reliable processing.
- AI Customer Support Engine: Utilizes the Gemini API (gemini-1.5-flash or gemini-1.5-pro) to generate AI-driven customer support responses based on company knowledge provided via environment variables, following a structured prompt template.
- AI Response Parsing Tool: A tool to parse the JSON response from the Gemini API and provide a fallback mechanism for malformed outputs, ensuring consistent response structure.
- Interaction Logging: Logs all customer messages and AI responses, along with metadata (session ID, message ID, confidence, category, timestamps), to a Firestore database for observability and analysis.
- Standardized API Response: Formats the processed AI's answer, confidence score, category, and a success status into a standardized JSON response for the client applications.

## Style Guidelines:

- Primary color: A professional and trustworthy medium-dark blue (#357CB2). Its hue is selected to convey reliability and efficiency.
- Background color: A very light, desaturated shade of the primary blue (#E7EFF4). This creates a clean and calm visual foundation, supporting a light color scheme.
- Accent color: A vibrant, clear teal-like hue (#54D1D1), slightly cooler than the primary. It is used sparingly for highlighting important information or calls to action to create dynamic contrast.
- Body and headline font: 'Inter', a modern grotesque-style sans-serif. It is chosen for its excellent readability, neutrality, and professional appearance, suitable for displaying objective and structured information.
- Minimalist and clear iconography, favoring outlines or simple fills, to reflect the efficiency and straightforward nature of a customer support tool.
- Clean, structured, and information-dense layouts (for any potential management UI) focusing on optimal readability and logical organization of interaction data and analytics.
- Subtle and functional animations, such as smooth transitions for state changes or simple loaders, providing non-distracting feedback during backend processing or data fetching.