import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ path?: string[] }>;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path?: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, 'GET', path);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path?: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, 'POST', path);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path?: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, 'PUT', path);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path?: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, 'DELETE', path);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path?: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, 'PATCH', path);
}

async function proxyRequest(request: NextRequest, method: string, pathSegments?: string[]) {
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://51.20.250.43:3000';

        // Build target path
        const path = pathSegments ? `/${pathSegments.join('/')}` : '';
        const url = new URL(request.url);
        const targetUrl = `${backendUrl}${path}${url.search}`;

        console.log(`[API Proxy] ${method} ${targetUrl}`);

        // Get request body if present
        let body = null;
        if (method !== 'GET' && method !== 'DELETE') {
            const contentType = request.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                try {
                    body = JSON.stringify(await request.json());
                } catch (e) {
                    // No JSON body
                }
            } else if (contentType?.includes('multipart/form-data')) {
                body = await request.formData();
            } else {
                const text = await request.text();
                if (text) body = text;
            }
        }

        // Forward headers
        const headers: HeadersInit = {};
        request.headers.forEach((value, key) => {
            if (!['host', 'content-length', 'connection'].includes(key.toLowerCase())) {
                headers[key] = value;
            }
        });

        // Make request to backend
        const response = await fetch(targetUrl, {
            method,
            headers,
            body,
        });

        // Get response body
        const responseBody = await response.text();

        // Return response
        return new NextResponse(responseBody, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error: any) {
        console.error('[API Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Proxy error', message: error.message },
            { status: 500 }
        );
    }
}
