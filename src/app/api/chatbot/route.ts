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

    if(!completion.choices[0].message.content) {
    throw new Error('No response from OpenAI');
  }

    return NextResponse.json({ message: completion.choices[0].message.content }, { status: 200});

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
