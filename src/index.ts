#!/usr/bin/env node

import { OSRSMCPServer } from './server.js';

async function main(): Promise<void> {
  const server = new OSRSMCPServer();
  await server.run();
}

main().catch((error) => {
  console.error('Failed to start OSRS MCP server:', error);
  process.exit(1);
});