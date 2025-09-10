import http from 'http';

const API_KEY = process.env.MCP_API_KEY;

const resources = {
  cat_fact: {
    name: 'Random Cat Fact',
    description: 'Fetches a random cat fact from catfact.ninja',
    url: 'https://catfact.ninja/fact'
  }
};

const server = http.createServer(async (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end();
    return;
  }

  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const { id, method, params } = json;
  const response = { jsonrpc: '2.0', id };

  if (method === 'list_resources') {
    response.result = Object.keys(resources).map((key) => ({
      id: key,
      name: resources[key].name,
      description: resources[key].description
    }));
  } else if (method === 'read_resource') {
    const resourceId = params && params.id;
    const resource = resources[resourceId];
    if (!resource) {
      response.error = { code: -32602, message: 'Unknown resource' };
    } else {
      try {
        const apiResp = await fetch(resource.url);
        const data = await apiResp.json();
        response.result = { resourceId, data };
      } catch (e) {
        response.error = { code: -32000, message: 'Failed to fetch resource' };
      }
    }
  } else {
    response.error = { code: -32601, message: 'Method not found' };
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});
