import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Target, Eye, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const TeamModeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const modes = [
    {
      id: 'matrix' as const,
      name: 'Matrix',
      icon: Zap,
      description: 'Classic green hacker style',
      color: 'text-green-400'
    },
    {
      id: 'attack' as const,
      name: 'Red Team',
      icon: Target,
      description: 'Offensive security operations',
      color: 'text-red-400'
    },
    {
      id: 'defense' as const,
      name: 'Blue Team',
      icon: Shield,
      description: 'Defensive security operations',
      color: 'text-blue-400'
    },
    {
      id: 'ops' as const,
      name: 'Purple Ops',
      icon: Eye,
      description: 'Combined offensive & defensive',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="glass-intense rounded-xl p-6">
      <h3 className="text-lg font-semibold text-glow mb-4">Operation Mode</h3>
      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = theme === mode.id;
          
          return (
            <Button
              key={mode.id}
              onClick={() => setTheme(mode.id)}
              variant={isActive ? "default" : "outline"}
              className={`
                h-20 flex flex-col items-center justify-center gap-2 
                ${isActive 
                  ? 'bg-cyber-gradient glow text-black font-semibold' 
                  : 'glass border-cyber hover-glow'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-black' : mode.color}`} />
              <div className="text-center">
                <div className={`text-sm font-medium ${isActive ? 'text-black' : ''}`}>
                  {mode.name}
                </div>
                <div className={`text-xs opacity-70 ${isActive ? 'text-black' : ''}`}>
                  {mode.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TeamModeSwitch;