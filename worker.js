
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    // 返回允许跨域请求的头部信息
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST', // 允许的请求方法
        'Access-Control-Allow-Headers': 'Content-Type', // 允许的请求头部
      },
    });
  }
  
  if (request.method === 'POST') {
    // 从前端请求中获取数据
    const data = await request.json();
    
    // 构造转发的请求对象
    const url = 'https://api.cloudflareclient.com/v0a977/reg';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':'okhttp/3.12.1',
        // 可以根据需要设置其他头部信息
      },
      body: JSON.stringify(data), // 将前端发送的数据转发到目标地址
    };

    try {
      // 发起转发请求到目标地址并获取响应
      const response = await fetch(url, requestOptions);
      
      // 获取响应的 JSON 数据
      const responseData = await response.json();

      // 创建新的响应对象，将转发得到的 JSON 数据返回给前端
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // 设置允许的来源
        },
      });
    } catch (error) {
      // 如果转发请求失败，返回错误信息给前端
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // 设置允许的来源
        },
      });
    }
  } else {
    // 处理其他请求方式
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed',
      headers: {
        'Allow': 'POST',
      },
    });
  }
}
