import { NextRequest, NextResponse } from 'next/server';

// Mock in-memory storage (shared with parent route)
// In production, this would connect to your actual database
let templates: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = templates.find(t => t.id === id);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('GET template error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    templates[index] = {
      ...templates[index],
      ...body,
      id, // Preserve the ID
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(templates[index]);
  } catch (error) {
    console.error('PUT template error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    templates.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
