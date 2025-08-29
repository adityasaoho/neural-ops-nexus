import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, Zap, Shield, Target, Eye } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CommandInputProps {
  onCommand: (command: string) => void;
  isProcessing?: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onCommand, isProcessing = false }) => {
  const [input, setInput] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'attack': return <Target className="w-4 h-4" />;
      case 'defense': return <Shield className="w-4 h-4" />;
      case 'ops': return <Eye className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  const quickCommands = [
    'scan ports on 192.168.1.1',
    'check network connections', 
    'monitor traffic on eth0',
    'brute force SSH on target'
  ];

  return (
    <div className="glass-intense rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cyber-gradient rounded-lg glow">
          {getThemeIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-glow">AI Command Interface</h3>
          <p className="text-sm text-muted-foreground">Natural language to Linux terminal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command in natural language... (e.g., 'scan port 443 on 192.168.1.1')"
          className="glass border-cyber hover-glow font-mono"
          disabled={isProcessing}
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || isProcessing}
          className="bg-cyber-gradient hover:glow-intense px-6"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 animate-pulse-glow">
                <Zap className="w-full h-full" />
              </div>
              Processing...
            </div>
          ) : (
            'Execute'
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {quickCommands.map((cmd, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => setInput(cmd)}
            className="glass border-cyber hover-glow text-xs"
          >
            {cmd}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommandInput;