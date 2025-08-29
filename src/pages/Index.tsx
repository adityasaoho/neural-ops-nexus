import { ThemeProvider } from '@/contexts/ThemeContext';
import CyberDashboard from '@/components/cyber/CyberDashboard';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <CyberDashboard />
      </div>
    </ThemeProvider>
  );
};

export default Index;
