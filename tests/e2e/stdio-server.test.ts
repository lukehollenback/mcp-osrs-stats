import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';

describe('MCP Server E2E Tests via Stdio', () => {
  let serverProcess: ChildProcess;
  let serverReady = false;
  
  const projectRoot = resolve(__dirname, '../..');
  const serverScript = resolve(projectRoot, 'dist/index.js');

  beforeAll(async () => {
    // Build the project first
    const { execSync } = require('child_process');
    execSync('npm run build', { cwd: projectRoot });
    
    // Start the server
    serverProcess = spawn('node', [serverScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: projectRoot
    });

    // Wait for server to be ready
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 10000);

      serverProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        if (output.includes('OSRS Player Stats MCP server running')) {
          serverReady = true;
          clearTimeout(timeout);
          resolve();
        }
      });

      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  });

  afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });

  const sendMcpRequest = async (request: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      let responseData = '';
      
      const onData = (data: Buffer) => {
        responseData += data.toString();
        
        // Check if we have a complete JSON response
        try {
          const lines = responseData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              serverProcess.stdout?.off('data', onData);
              clearTimeout(timeout);
              resolve(response);
              return;
            }
          }
        } catch (e) {
          // Not a complete JSON yet, continue waiting
        }
      };

      serverProcess.stdout?.on('data', onData);
      
      // Send the request
      const requestJson = JSON.stringify(request) + '\n';
      serverProcess.stdin?.write(requestJson);
    });
  };

  test('server should start and be ready', () => {
    expect(serverReady).toBe(true);
    expect(serverProcess).toBeDefined();
    expect(serverProcess.killed).toBe(false);
  });

  test('should list all available tools', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };

    const response = await sendMcpRequest(request);
    
    expect(response.result).toBeDefined();
    expect(response.result.tools).toHaveLength(4);
    
    const toolNames = response.result.tools.map((tool: any) => tool.name);
    expect(toolNames).toContain('get_player_stats');
    expect(toolNames).toContain('get_skill_leaderboard');
    expect(toolNames).toContain('get_activity_leaderboard');
    expect(toolNames).toContain('compare_players');
  });

  test('should handle get_player_stats with validation error', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_player_stats',
        arguments: {
          username: '', // Invalid empty username
          gamemode: 'main'
        }
      }
    };

    const response = await sendMcpRequest(request);
    
    expect(response.error).toBeDefined();
    expect(response.error.message).toContain('Username');
  });

  test('should handle get_skill_leaderboard with validation error', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_skill_leaderboard',
        arguments: {
          skill: 'invalid_skill', // Invalid skill name
          gamemode: 'main'
        }
      }
    };

    const response = await sendMcpRequest(request);
    
    expect(response.error).toBeDefined();
    expect(response.error.message).toContain('skill');
  });

  test('should handle compare_players with validation error', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'compare_players',
        arguments: {
          usernames: ['OnlyOne'], // Need at least 2 usernames
          focus: 'skills'
        }
      }
    };

    const response = await sendMcpRequest(request);
    
    expect(response.error).toBeDefined();
    expect(response.error.message).toContain('2 usernames');
  });

  test('should handle unknown tool name', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'unknown_tool',
        arguments: {}
      }
    };

    const response = await sendMcpRequest(request);
    
    expect(response.error).toBeDefined();
    expect(response.error.message).toContain('Unknown tool');
  });

  test('should handle malformed JSON request', async () => {
    return new Promise<void>((resolve) => {
      // Send malformed JSON
      serverProcess.stdin?.write('{"invalid": json}\n');
      
      // The server should continue running and not crash
      setTimeout(() => {
        expect(serverProcess.killed).toBe(false);
        resolve();
      }, 2000);
    });
  });

  // Note: Real API tests are commented out to avoid external dependencies
  // Uncomment these for manual testing with real OSRS API
  
  /*
  test('should fetch real player stats (manual test)', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'get_player_stats',
        arguments: {
          username: 'Zezima',
          gamemode: 'main'
        }
      }
    };

    const response = await sendMcpRequest(request);
    
    expect(response.result).toBeDefined();
    expect(response.result.content).toHaveLength(1);
    
    const result = JSON.parse(response.result.content[0].text);
    expect(result.username).toBe('Zezima');
    expect(result.skills).toBeDefined();
  }, 60000);

  test('should fetch real skill leaderboard (manual test)', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: {
        name: 'get_skill_leaderboard',
        arguments: {
          skill: 'overall',
          gamemode: 'main',
          page: 1
        }
      }
    };

    const response = await sendMcpRequest(request);
    
    expect(response.result).toBeDefined();
    const result = JSON.parse(response.result.content[0].text);
    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.entries[0].rank).toBe(1);
  }, 60000);
  */
});