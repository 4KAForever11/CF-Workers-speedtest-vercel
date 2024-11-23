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
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 获取请求路径
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理不同的路由
    if (path.endsWith('/download')) {
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
    } else if (path.endsWith('/upload')) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      // 上传测试 - 仅返回接收到的数据大小
      const blob = await request.blob();
      return new Response(JSON.stringify({ size: blob.size }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      });
    }

    return new Response('Invalid endpoint', { status: 404 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error: ' + error.message, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      }
    });
  }
} 