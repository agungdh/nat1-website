const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export const POST = async ({ request }: { request: Request }) => {
  const { messages } = await request.json();

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Backend chat error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    const reply = data.reply || '';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(reply));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
