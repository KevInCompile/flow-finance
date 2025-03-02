import { NextResponse } from "next/server";
import OpenAI from 'openai'

if(!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        ...messages
      ],
      model: "deepseek-chat",
    });

    clearTimeout(timeoutId);

    if(!completion.choices[0].message.content) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ message: completion.choices[0].message.content }, { status: 200});

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
