import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Hola, esta es una API en Next.js con TypeScript" });
}
