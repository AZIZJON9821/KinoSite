import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
    return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
    return proxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
    return proxyRequest(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
    return proxyRequest(request, 'PATCH');
}

async function proxyRequest(request: NextRequest, method: string) {
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://51.20.250.43:3000';

        // Extract path after /api-backend/
        const url = new URL(request.url);
        const path = url.pathname.replace('/api-backend', '');
        const targetUrl = `${backendUrl}${path}${url.search}`;

        // Get request body if present
        let body = null;
        if (method !== 'GET' && method !== 'DELETE') {
            const contentType = request.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                body = JSON.stringify(await request.json());
            } else if (contentType?.includes('multipart/form-data')) {
                body = await request.formData();
            } else {
                body = await request.text();
            }
        }

        // Forward headers
        const headers: HeadersInit = {};
        request.headers.forEach((value, key) => {
            // Skip host and content-length headers
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
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy error', message: error.message },
            { status: 500 }
        );
    }
}
