import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

const API_KEY = import.meta.env.OPENCODE_API_KEY;

if (!API_KEY) {
    throw new Error('Missing OPENCODE_API_KEY environment variable');
}

const opencode = createOpenAICompatible({
    name: 'opencode',
    baseURL: 'https://opencode.ai/zen/go/v1',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    },
});

export const POST = async ({ request }: { request: Request }) => {
    const { messages } = await request.json();

    const result = streamText({
        model: opencode('deepseek-v4-pro'),
        messages: messages.slice(-20),
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of result.textStream) {
                    controller.enqueue(encoder.encode(chunk));
                }
                controller.close();
            } catch (error) {
                const msg = error instanceof Error ? error.message : 'Unknown error';
                controller.enqueue(encoder.encode(`__ERROR__${msg}`));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
