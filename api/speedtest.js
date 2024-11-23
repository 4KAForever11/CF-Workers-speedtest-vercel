export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  try {
    // 处理OPTIONS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 获取请求类型
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    // 处理不同的测试类型
    if (type === 'download') {
      // 下载测试 - 生成随机数据
      const size = Math.min(
        parseInt(url.searchParams.get('size')) || 1024 * 1024,
        10 * 1024 * 1024  // 最大10MB
      );
      
      // 使用更小的块大小
      const chunkSize = 32768; // 32KB
      const data = new Uint8Array(size);
      
      // 分块生成随机数据
      for (let offset = 0; offset < size; offset += chunkSize) {
        const length = Math.min(chunkSize, size - offset);
        const chunk = new Uint8Array(length);
        crypto.getRandomValues(chunk);
        data.set(chunk, offset);
      }
      
      return new Response(data.buffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': size.toString(),
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      });
    } else if (type === 'upload' && request.method === 'POST') {
      try {
        const contentLength = request.headers.get('content-length');
        if (!contentLength) {
          throw new Error('Missing Content-Length header');
        }

        const size = parseInt(contentLength);
        if (isNaN(size)) {
          throw new Error('Invalid Content-Length header');
        }

        // 读取整个请求体
        const arrayBuffer = await request.arrayBuffer();
        
        if (arrayBuffer.byteLength !== size) {
          throw new Error('Size mismatch');
        }

        return new Response(JSON.stringify({ 
          size: arrayBuffer.byteLength,
          status: 'success' 
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ 
          error: error.message,
          status: 'error' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
    }

    return new Response('Invalid request', { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Headers': '*',
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error: ' + error.message, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Headers': '*',
      }
    });
  }
} 