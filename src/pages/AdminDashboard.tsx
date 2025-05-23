
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total de Clientes',
      value: '24',
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Solicitações Pendentes',
      value: '12',
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Projetos Este Mês',
      value: '48',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      client: 'João Silva',
      type: 'Card de Produto',
      status: 'pendente',
      date: '2024-01-15'
    },
    {
      id: 2,
      client: 'Maria Santos',
      type: 'Postagem Instagram',
      status: 'em-andamento',
      date: '2024-01-14'
    },
    {
      id: 3,
      client: 'Pedro Costa',
      type: 'Edição de Vídeo',
      status: 'concluido',
      date: '2024-01-13'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'concluido':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus clientes e solicitações
          </p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600 text-white">
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Solicitações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {request.type}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.client} • {request.date}
                    </p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Solicitações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Atividades Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Reunião com Cliente - João Silva
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">14:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Entrega de Projeto - Maria Santos
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">16:30</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
