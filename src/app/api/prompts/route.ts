import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET() {
  try {
    const prompts = await dbService.getPrompts();
    return NextResponse.json(prompts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await dbService.createPrompt({
      name: body.name,
      category: body.category,
      provider: body.provider,
      model: body.model,
      version: body.version || '1.0',
      temperature: parseFloat(body.temperature) || 0.7,
      prompt: body.prompt,
      active: body.active !== false
    });
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
