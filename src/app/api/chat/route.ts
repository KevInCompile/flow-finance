import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const form = await req.json();
  const { expenses, incomes, currency } = form;

  const model = deepseek('deepseek-chat');

  try {
    const { text } = await generateText({
      prompt: `Eres como un asesor financiero, te voy a dar mis ingresos y gastos, dime como puedo mejorar mi presupuesto o que puedo mejorar con eso, teniendo encuenta la divisa tambien, ingresos: ${expenses}, gastos: ${incomes}, moneda: ${currency}`,
      model
    });
    return NextResponse.json({message: text}, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred'}, { status: 500 })
  }
}
