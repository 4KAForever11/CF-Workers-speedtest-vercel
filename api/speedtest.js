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
      
      // 分块生成数据
      const chunkSize = 65536; // 64KB
      const chunks = [];
      for (let i = 0; i < size; i += chunkSize) {
        const chunk = new Uint8Array(Math.min(chunkSize, size - i));
        crypto.getRandomValues(chunk);
        chunks.push(chunk);
      }
      
      // 合并所有数据块
      const data = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
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
      // 直接获取请求体的 ArrayBuffer
      const arrayBuffer = await request.arrayBuffer();
      const size = arrayBuffer.byteLength;

      return new Response(JSON.stringify({ size }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
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