# MCP Cat Fact Demo

This project provides a minimal [Model Context Protocol](https://github.com/modelcontextprotocol/specification) server that proxies the public [catfact.ninja](https://catfact.ninja) API. The server exposes a single resource returning a random cat fact.

## Running the server

```bash
export MCP_API_KEY=your_key
npm run mcp-server
```

## Notebook

The Jupyter notebook at `notebooks/mcp_openai_demo.ipynb` demonstrates fetching a fact from the MCP server and sending it to the OpenAI Chat Completions API.

The notebook expects the same `MCP_API_KEY` environment variable to be set so it can authenticate with the server.
