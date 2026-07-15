const http = require('http');

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', e => resolve({ error: e.message }));
    
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log("Testing /api/auth/login...");
  const login = await testEndpoint('/api/auth/login', 'POST', { email: "admin@zoo.com", password: "password" });
  console.log(login);
  
  console.log("\nTesting /api/vet/dashboard...");
  const vetDash = await testEndpoint('/api/vet/dashboard', 'GET');
  console.log(vetDash);
  
  console.log("\nTesting /api/admin/dashboard...");
  const adminDash = await testEndpoint('/api/admin/dashboard', 'GET');
  console.log(adminDash);
}

run();
