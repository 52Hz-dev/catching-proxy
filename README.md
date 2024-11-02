
# Caching Proxy Server

A simple command-line caching proxy server built with Node.js. The server forwards requests to a specified origin server, caches the responses, and serves cached responses on repeated requests. This can reduce the load on the origin server and speed up response times for frequently accessed data.

## Features

- Caches responses from the origin server to avoid duplicate requests.
- Returns cached responses with `X-Cache: HIT` header, and origin server responses with `X-Cache: MISS`.
- Command-line interface to set the server port, specify the origin URL, and clear the cache.
  
## Requirements

- Node.js (version 12 or higher)

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd caching-proxy

https://roadmap.sh/projects/caching-server
