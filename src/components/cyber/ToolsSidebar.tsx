import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Network, 
  Shield, 
  Lock, 
  Search, 
  Zap, 
  Eye, 
  Terminal,
  Database,
  Wifi,
  Bug,
  AlertTriangle,
  FileSearch,
  ChevronRight
} from 'lucide-react';

interface Tool {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  command: string;
}

interface ToolCategory {
  name: string;
  icon: React.ComponentType<any>;
  tools: Tool[];
}

const ToolsSidebar: React.FC<{ onToolSelect: (tool: Tool) => void }> = ({ onToolSelect }) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('reconnaissance');

  const toolCategories: ToolCategory[] = [
    {
      name: 'Reconnaissance',
      icon: Search,
      tools: [
        { name: 'Nmap', description: 'Network discovery and security auditing', icon: Network, category: 'recon', command: 'nmap' },
        { name: 'Masscan', description: 'High-speed port scanner', icon: Zap, category: 'recon', command: 'masscan' },
        { name: 'Netstat', description: 'Display network connections', icon: Network, category: 'recon', command: 'netstat' },
        { name: 'Netdiscover', description: 'Network address discovering tool', icon: Wifi, category: 'recon', command: 'netdiscover' }
      ]
    },
    {
      name: 'Web Testing',
      icon: FileSearch,
      tools: [
        { name: 'Nikto', description: 'Web server scanner', icon: Bug, category: 'web', command: 'nikto' },
        { name: 'Gobuster', description: 'Directory/file & DNS brute-forcer', icon: Search, category: 'web', command: 'gobuster' },
        { name: 'SQLmap', description: 'SQL injection testing tool', icon: Database, category: 'web', command: 'sqlmap' },
        { name: 'Dirb', description: 'Web content scanner', icon: FileSearch, category: 'web', command: 'dirb' }
      ]
    },
    {
      name: 'Exploitation',
      icon: AlertTriangle,
      tools: [
        { name: 'Hydra', description: 'Password brute-force tool', icon: Lock, category: 'exploit', command: 'hydra' },
        { name: 'John', description: 'Password cracker', icon: Lock, category: 'exploit', command: 'john' },
        { name: 'Hashcat', description: 'Advanced password recovery', icon: Zap, category: 'exploit', command: 'hashcat' },
        { name: 'Metasploit', description: 'Penetration testing framework', icon: AlertTriangle, category: 'exploit', command: 'msfconsole' }
      ]
    },
    {
      name: 'Defense',
      icon: Shield,
      tools: [
        { name: 'Fail2ban', description: 'Intrusion prevention system', icon: Shield, category: 'defense', command: 'fail2ban-client' },
        { name: 'UFW', description: 'Uncomplicated firewall', icon: Shield, category: 'defense', command: 'ufw' },
        { name: 'Suricata', description: 'Network threat detection', icon: Eye, category: 'defense', command: 'suricata' },
        { name: 'AIDE', description: 'File integrity checker', icon: FileSearch, category: 'defense', command: 'aide' }
      ]
    },
    {
      name: 'Monitoring',
      icon: Eye,
      tools: [
        { name: 'Tcpdump', description: 'Network packet analyzer', icon: Network, category: 'monitor', command: 'tcpdump' },
        { name: 'Wireshark', description: 'Network protocol analyzer', icon: Network, category: 'monitor', command: 'tshark' },
        { name: 'ss', description: 'Socket statistics', icon: Network, category: 'monitor', command: 'ss' },
        { name: 'iftop', description: 'Network bandwidth monitor', icon: Wifi, category: 'monitor', command: 'iftop' }
      ]
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? '' : categoryName);
  };

  return (
    <div className="glass-intense rounded-xl h-full flex flex-col">
      <div className="p-4 border-b border-cyber">
        <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Cyber Arsenal
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Click tools to add to command input
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {toolCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategory === category.name.toLowerCase();

            return (
              <div key={category.name} className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(category.name.toLowerCase())}
                  className="w-full justify-between hover-glow border border-transparent hover:border-cyber"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-cyber-primary" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  />
                </Button>

                {isExpanded && (
                  <div className="space-y-1 pl-6 animate-fade-in">
                    {category.tools.map((tool) => {
                      const ToolIcon = tool.icon;
                      return (
                        <Button
                          key={tool.name}
                          variant="ghost"
                          onClick={() => onToolSelect(tool)}
                          className="w-full justify-start text-left hover-glow glass border border-transparent hover:border-cyber p-3"
                        >
                          <div className="flex items-start gap-3">
                            <ToolIcon className="w-4 h-4 text-cyber-secondary mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-sm">{tool.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {tool.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}

                {category.name !== 'Monitoring' && <Separator className="bg-cyber/30" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ToolsSidebar;