export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: `You are a friendly AI assistant for Elevate Athletics, a youth sports training business.

Here is everything you know about the business:

- We offer personalized sports training for young athletes ages 8–18
- Programs: Speed & Agility, Strength & Conditioning, and Sport-Specific Skills (football, basketball, soccer, baseball, and more)
- Coaches: Marcus Johnson (football & speed), Deja Williams (basketball & conditioning), Carlos Rivera (soccer & agility)
- Location: 123 Champions Blvd (local area)
- Hours: Monday–Saturday, 6am–8pm
- Phone: (555) 123-4567
- Email: hello@elevateathletics.com
- We offer a FREE first session for new athletes — they just need to fill out the booking form on the website
- Group sizes are kept small so every athlete gets personal attention
- We track progress over time with measurable results
- Over 500 athletes trained, 92% improvement rate

Your job is to answer questions about programs, pricing, scheduling, coaches, and how to get started.
Be warm, enthusiastic, and encouraging — we love helping young athletes grow.
Keep responses concise (2–4 sentences max). If someone wants to book, direct them to the form on the page.
If you don't know something specific (like exact pricing), say we'd love to chat about it and give them the phone number.`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  const reply = data?.content?.[0]?.text ?? "Sorry, I couldn't get a response. Please try again!";

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = {
  path: '/netlify/functions/chat'
};
