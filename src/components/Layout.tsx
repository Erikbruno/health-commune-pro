import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Users, 
  BarChart3,
  Stethoscope
} from 'lucide-react';
import { User, AttendantStatus } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const getStatusColor = (status: AttendantStatus) => {
    switch (status) {
      case 'online': return 'bg-status-online';
      case 'away': return 'bg-status-away';
      case 'busy': return 'bg-status-busy';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-medical-light">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-medical-blue" />
              <h1 className="text-xl font-bold text-foreground">MedClinic Omnichannel</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user.role === 'manager' ? 'Gerente' : 'Atendente'}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status || 'offline')}`} />
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.status || 'offline'}
                  </p>
                </div>
              </div>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border px-6 py-2">
        <div className="flex space-x-6">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Conversas</span>
          </Button>
          {user.role === 'manager' && (
            <>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Equipe</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;