#!/usr/bin/env node

const http=require('http');
const httpProxy=require('http-proxy');
const yargs=require('yargs');
const axios=require('axios');

// set up argument parsing


const argv = yargs
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port for the caching proxy server',
    demandOption: false,
  })
  .option('origin', {
    alias: 'o',
    type: 'string',
    description: 'Origin server URL',
    demandOption: false,
  })
  .option('clear-cache', {
    type: 'boolean',
    description: 'Clear the cache',
    demandOption: false,
  })
  .help()
  .argv;

  const cache = new Map();

  if (argv['clear-cache']) {
    cache.clear();
    console.log('Cache cleared.');
    process.exit(0);
  }
  
  if (!argv.port || !argv.origin) {
    console.error('Both --port and --origin options are required.');
    process.exit(1);
  }
  
  const port = argv.port;
  const origin = argv.origin;
  
  const proxy = httpProxy.createProxyServer({});

  const server = http.createServer(async (req, res) => {
    const cacheKey = req.url;
  
    if (cache.has(cacheKey)) {
      const cachedResponse = cache.get(cacheKey);
      res.writeHead(200, { 'X-Cache': 'HIT', ...cachedResponse.headers });
      res.end(cachedResponse.body);
    } else {
      try {
        const originResponse = await axios.get(`${origin}${req.url}`);
        cache.set(cacheKey, {
          body: originResponse.data,
          headers: originResponse.headers,
        });
        res.writeHead(200, { 'X-Cache': 'MISS', ...originResponse.headers });
        res.end(originResponse.data);
      } catch (error) {
        console.error('Error fetching from origin:', error.message);
        res.writeHead(500);
        res.end('Error fetching from origin');
      }
    }
  });

  server.listen(port, () => {
    console.log(`Caching proxy server running on http://localhost:${port}`);
    console.log(`Forwarding requests to origin: ${origin}`);
  });
  
  