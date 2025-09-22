import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Star,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockDashboardMetrics, mockAttendantMetrics } from '@/data/mockData';
import ChannelIcon from './ChannelIcon';

const ManagerDashboard: React.FC = () => {
  const metrics = mockDashboardMetrics;
  const attendants = mockAttendantMetrics;

  const channelData = Object.entries(metrics.channelDistribution).map(([channel, count]) => ({
    name: channel,
    value: count,
    color: getChannelColor(channel)
  }));

  function getChannelColor(channel: string): string {
    switch (channel) {
      case 'whatsapp': return '#25D366';
      case 'instagram': return '#E4405F';
      case 'facebook': return '#1877F2';
      case 'email': return '#34A853';
      default: return '#6B7280';
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-status-online';
      case 'away': return 'bg-status-away';
      case 'busy': return 'bg-status-busy';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Conversas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversas Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingConversations}</div>
            <p className="text-xs text-muted-foreground">
              -3% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo Médio de Resposta
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}min</div>
            <p className="text-xs text-muted-foreground">
              -0.5min desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfação
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.satisfactionRate}/5</div>
            <p className="text-xs text-muted-foreground">
              +0.2 desde ontem
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Bar dataKey="conversations" fill="hsl(var(--medical-blue))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChannelIcon channel={channel.name as any} />
                    <span className="text-sm font-medium capitalize">
                      {channel.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24">
                      <Progress 
                        value={(channel.value / metrics.totalConversations) * 100} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {channel.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Performance da Equipe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendants.map((attendant) => (
              <div key={attendant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{attendant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{attendant.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(attendant.status)}`} />
                      <span className="text-sm text-muted-foreground capitalize">
                        {attendant.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold">{attendant.totalConversations}</p>
                    <p className="text-xs text-muted-foreground">Conversas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{attendant.activeConversations}</p>
                    <p className="text-xs text-muted-foreground">Ativas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{attendant.avgResponseTime}min</p>
                    <p className="text-xs text-muted-foreground">Tempo Médio</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{attendant.satisfactionRate}/5</p>
                    <p className="text-xs text-muted-foreground">Satisfação</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;