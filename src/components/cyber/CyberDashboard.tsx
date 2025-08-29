import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInput from './CommandInput';
import TerminalPanel from './TerminalPanel';
import TeamModeSwitch from './TeamModeSwitch';
import ToolsSidebar from './ToolsSidebar';
import { Button } from '@/components/ui/button';
import { History, Star, Settings, Activity, Network, Database } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TerminalEntry {
  id: string;
  timestamp: string;
  input: string;
  command: string;
  output: string[];
  type: 'success' | 'error' | 'info';
}

interface Tool {
  name: string;
  description: string;
  command: string;
}

const CyberDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([]);
  const [isTerminalFullscreen, setIsTerminalFullscreen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [networkHosts, setNetworkHosts] = useState<any[]>([]);

  // Real API integration with backend
  const translateCommand = async (input: string): Promise<{ command: string, output: string[], type: 'success' | 'error' | 'info' }> => {
    try {
      const response = await fetch('http://localhost:8000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input,
          mode: theme === 'attack' ? 'attack' : theme === 'defense' ? 'defense' : theme === 'ops' ? 'ops' : 'matrix'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        command: data.command,
        output: data.output,
        type: data.type as 'success' | 'error' | 'info'
      };
    } catch (error) {
      console.error('Backend API error:', error);
      // Fallback to mock behavior when backend is unavailable
      return {
        command: `# Backend unavailable - mock: ${input}`,
        output: [
          'Backend connection failed. Showing mock response.',
          'To enable real Linux integration:',
          '1. Start the backend: cd backend && python main.py',
          '2. Install required tools: nmap, hydra, sqlmap, etc.',
          '3. Ensure proper permissions for tool execution'
        ],
        type: 'error' as const
      };
    }
  };

  const handleCommand = async (input: string) => {
    setIsProcessing(true);
    
    try {
      const result = await translateCommand(input);
      const timestamp = new Date().toLocaleTimeString();
      
      const newEntry: TerminalEntry = {
        id: Date.now().toString(),
        timestamp,
        input,
        command: result.command,
        output: result.output,
        type: result.type
      };
      
      setTerminalEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error('Command processing error:', error);
      
      // Add error entry
      const errorEntry: TerminalEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        input,
        command: '# Error processing command',
        output: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        type: 'error'
      };
      
      setTerminalEntries(prev => [...prev, errorEntry]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockOutput = (command: string): { output: string[], type: 'success' | 'error' | 'info' } => {
    if (command.startsWith('#')) {
      return {
        output: ['Command translation failed. Please try a different approach.'],
        type: 'error'
      };
    }

    if (command.includes('nmap')) {
      return {
        output: [
          'Starting Nmap 7.94 ( https://nmap.org )',
          'Nmap scan report for target',
          'Host is up (0.001s latency).',
          'PORT     STATE SERVICE',
          '22/tcp   open  ssh',
          '80/tcp   open  http',
          '443/tcp  open  https',
          '',
          'Nmap done: 1 IP address (1 host up) scanned in 0.12 seconds'
        ],
        type: 'success'
      };
    }

    if (command.includes('netstat')) {
      return {
        output: [
          'Active Internet connections (only servers)',
          'Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name',
          'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd',
          'tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      5678/mysqld',
          'tcp6       0      0 :::80                   :::*                    LISTEN      9012/apache2'
        ],
        type: 'success'
      };
    }

    return {
      output: [
        `Executing: ${command}`,
        'Command completed successfully.',
        'Use --help for more options.'
      ],
      type: 'info'
    };
  };

  const handleToolSelect = (tool: Tool) => {
    // Auto-fill command input with tool usage example
    const examples: Record<string, string> = {
      'nmap': 'scan all ports on 192.168.1.1',
      'hydra': 'brute force SSH on 192.168.1.10', 
      'sqlmap': 'test SQL injection on http://target.com/login',
      'gobuster': 'scan directories on http://target.com',
      'tcpdump': 'monitor traffic on eth0',
      'netstat': 'check network connections',
      'nikto': 'scan web server at http://192.168.1.1',
      'dirb': 'scan directories on http://target.com'
    };
    
    const example = examples[tool.command] || `use ${tool.name} on target`;
    handleCommand(example);
  };

  const discoverNetwork = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/network/discover');
      if (response.ok) {
        const data = await response.json();
        setNetworkHosts(data.hosts || []);
      }
    } catch (error) {
      console.error('Network discovery failed:', error);
      setNetworkHosts([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen p-4 space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-3xl font-bold text-glow"
          >
            MINI HEART X
          </motion.h1>
          <p className="text-muted-foreground">AI-Powered Cyber Operations Assistant</p>
        </div>
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-3"
        >
          <Button variant="outline" size="sm" className="glass border-cyber hover-glow">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm" className="glass border-cyber hover-glow">
            <Star className="w-4 h-4 mr-2" />
            Favorites
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="glass border-cyber hover-glow"
            onClick={discoverNetwork}
          >
            <Network className="w-4 h-4 mr-2" />
            Network
          </Button>
          <Button variant="outline" size="sm" className="glass border-cyber hover-glow">
            <Settings className="w-4 h-4 mr-2" />
            Config
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Tools */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-3"
        >
          <ToolsSidebar onToolSelect={handleToolSelect} />
        </motion.div>

        {/* Center Content */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-6"
        >
          <CommandInput 
            onCommand={handleCommand} 
            isProcessing={isProcessing}
          />
          
          <TerminalPanel 
            entries={terminalEntries}
            isFullscreen={isTerminalFullscreen}
            onToggleFullscreen={() => setIsTerminalFullscreen(!isTerminalFullscreen)}
          />
        </motion.div>

        {/* Right Sidebar - Controls */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="col-span-3 space-y-6"
        >
          <TeamModeSwitch />
          
          {/* Status Panel */}
          <div className="glass-intense rounded-xl p-6">
            <h3 className="text-lg font-semibold text-glow mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Status
            </h3>
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-between items-center"
              >
                <span className="text-sm">AI Engine</span>
                <span className="text-green-400 text-sm">Online</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="flex justify-between items-center"
              >
                <span className="text-sm">Terminal</span>
                <span className="text-green-400 text-sm">Ready</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-between items-center"
              >
                <span className="text-sm">Commands</span>
                <span className="text-cyber-primary text-sm">{terminalEntries.length}</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
                className="flex justify-between items-center"
              >
                <span className="text-sm">Session</span>
                <span className="text-green-400 text-sm">Active</span>
              </motion.div>
            </div>
          </div>
          
          {/* Network Discovery Panel */}
          {networkHosts.length > 0 && (
            <div className="glass-intense rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-glow mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Network Hosts ({networkHosts.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {networkHosts.map((host, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex justify-between items-center text-sm p-2 glass rounded-lg"
                  >
                    <span className="text-cyber-primary font-mono">{host.ip}</span>
                    {host.vendor && (
                      <span className="text-muted-foreground text-xs">{host.vendor}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CyberDashboard;