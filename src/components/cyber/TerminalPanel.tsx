import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalEntry {
  id: string;
  timestamp: string;
  input: string;
  command: string;
  output: string[];
  type: 'success' | 'error' | 'info';
}

interface TerminalPanelProps {
  entries: TerminalEntry[];
  isFullscreen?: boolean;
  onToggleFullscreen: () => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ 
  entries, 
  isFullscreen = false, 
  onToggleFullscreen 
}) => {
  const [currentLine, setCurrentLine] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const simulateCommand = (command: string) => {
    // Simulate typing effect
    let i = 0;
    setCurrentLine('');
    const typeInterval = setInterval(() => {
      if (i < command.length) {
        setCurrentLine(command.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setCurrentLine(''), 1000);
      }
    }, 50);
  };

  return (
    <div className={`terminal glass-intense rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyber bg-glass-gradient">
        <div className="flex items-center gap-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-primary" />
            <span className="text-sm font-mono text-cyber-primary">mini-heart-x@cyber-ops:~$</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="hover-glow"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="p-4 font-mono text-sm overflow-y-auto h-full bg-terminal-bg"
        style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : '320px' }}
      >
        {/* Welcome message */}
        <div className="mb-4">
          <div className="text-cyber-glow animate-fade-in">
            ╔══════════════════════════════════════════════════════════════╗
          </div>
          <div className="text-cyber-glow animate-fade-in">
            ║                    MINI HEART X v1.0                        ║
          </div>
          <div className="text-cyber-glow animate-fade-in">
            ║              AI-Powered Cyber Operations Suite              ║
          </div>
          <div className="text-cyber-glow animate-fade-in">
            ╚══════════════════════════════════════════════════════════════╝
          </div>
          <div className="text-cyber-primary mt-2">
            System initialized. Ready for operations...
          </div>
        </div>

        {/* Terminal Entries */}
        {entries.map((entry) => (
          <div key={entry.id} className="mb-4 animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <div className="text-cyber-secondary text-xs">
                [{entry.timestamp}] Natural Input:
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(entry.command)}
                className="opacity-0 group-hover:opacity-100 hover-glow p-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-foreground mb-2 pl-4 border-l-2 border-cyber-primary/30">
              "{entry.input}"
            </div>
            <div className="text-cyber-secondary text-xs mb-1">
              Translated Command:
            </div>
            <div className="text-cyber-primary mb-2">
              <span className="text-cyber-glow">$</span> {entry.command}
            </div>
            <div className="text-foreground pl-4 space-y-1">
              {entry.output.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`${
                    entry.type === 'error' ? 'text-red-400' : 
                    entry.type === 'success' ? 'text-green-400' : 
                    'text-foreground'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Current typing line */}
        {currentLine && (
          <div className="flex items-center">
            <span className="text-cyber-glow">$</span>
            <span className="ml-2 text-cyber-primary">{currentLine}</span>
            <span className={`ml-1 text-cyber-glow ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
              █
            </span>
          </div>
        )}

        {/* Cursor prompt */}
        <div className="flex items-center mt-2">
          <span className="text-cyber-glow">$</span>
          <span className={`ml-2 text-cyber-glow ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
            █
          </span>
        </div>
      </div>
    </div>
  );
};

export default TerminalPanel;