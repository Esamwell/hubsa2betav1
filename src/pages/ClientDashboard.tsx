
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User } from 'lucide-react';

const ClientDashboard = () => {
  const myRequests = [
    {
      id: 1,
      type: 'Card de Produto',
      status: 'em-andamento',
      date: '2024-01-15',
      description: 'Card para novo produto de beleza'
    },
    {
      id: 2,
      type: 'Postagem Instagram',
      status: 'concluido',
      date: '2024-01-10',
      description: 'Post promocional para Black Friday'
    },
    {
      id: 3,
      type: 'Edição de Vídeo',
      status: 'pendente',
      date: '2024-01-12',
      description: 'Vídeo institucional da empresa'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Reunião de Briefing',
      date: '2024-01-20',
      time: '14:00'
    },
    {
      title: 'Entrega de Material',
      date: '2024-01-22',
      time: '10:00'
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
            Meu Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe suas solicitações e compromissos
          </p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600 text-white">
          Nova Solicitação
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Solicitações Ativas
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  2
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Concluídas Este Mês
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  5
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Próximos Eventos
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  2
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Minhas Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div key={request.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {request.type}
                    </h4>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {request.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Criado em {request.date}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Solicitações
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Próximos Compromissos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.date} às {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Calendário Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
