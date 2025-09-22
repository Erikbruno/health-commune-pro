import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  MessageSquare, 
  Users, 
  BarChart3,
  Shield
} from 'lucide-react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import Layout from '@/components/Layout';
import AttendantDashboard from '@/components/AttendantDashboard';
import ManagerDashboard from '@/components/ManagerDashboard';
import RealTimeNotifications from '@/components/RealTimeNotifications';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 to-medical-green/5 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Stethoscope className="h-16 w-16 text-medical-blue" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Sistema Omnichannel MedClinic
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma unificada de atendimento que integra WhatsApp, Instagram, Facebook, 
              e-mail e outros canais em uma única interface profissional.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-medical-blue mx-auto mb-4" />
                <CardTitle>Atendimento Unificado</CardTitle>
                <CardDescription>
                  Receba e responda mensagens de todos os canais em uma única plataforma
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-medical-green mx-auto mb-4" />
                <CardTitle>Relatórios Avançados</CardTitle>
                <CardDescription>
                  Monitore performance, tempo de resposta e satisfação dos pacientes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Segurança LGPD</CardTitle>
                <CardDescription>
                  Proteção completa dos dados dos pacientes conforme regulamentação
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Login Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-8 w-8 text-medical-blue" />
                  <div>
                    <CardTitle>Acesso do Atendente</CardTitle>
                    <CardDescription>
                      Gerencie conversas e atenda pacientes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin(mockUsers[0])}
                >
                  Entrar como Atendente
                </Button>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Maria Silva - Atendente
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-medical-green" />
                  <div>
                    <CardTitle>Acesso do Gerente</CardTitle>
                    <CardDescription>
                      Supervisione equipe e analise métricas
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleLogin(mockUsers[1])}
                >
                  Entrar como Gerente
                </Button>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Dr. João Santos - Gerente
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Este é um protótipo demonstrativo do Sistema Omnichannel para Clínicas Médicas
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="flex gap-6">
        <div className="flex-1">
          {currentUser.role === 'attendant' ? (
            <AttendantDashboard userId={currentUser.id} />
          ) : (
            <ManagerDashboard />
          )}
        </div>
        
        {/* Notifications Sidebar */}
        <div className="w-80">
          <RealTimeNotifications userId={currentUser.id} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;