import { NextRequest, NextResponse } from 'next/server';

// Mock in-memory storage for templates
// In production, this would connect to your actual database
let templates: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = templates.slice(startIndex, endIndex);

    return NextResponse.json({
      templates: paginatedTemplates,
      total: templates.length,
      page,
      limit,
    });
  } catch (error) {
    console.error('GET templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: body.name,
      description: body.description,
      width: body.width,
      height: body.height,
      canvas: body.canvas,
      thumbnail: body.thumbnail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'local-user', // In production, get from auth token
    };

    templates.push(newTemplate);

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('POST template error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
