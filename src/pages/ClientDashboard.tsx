import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [completedThisMonth, setCompletedThisMonth] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.client_id) {
      setLoading(false);
      return;
    }
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('client_id', user.client_id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setMyRequests(data);
        setActiveCount(data.filter(r => r.status === 'em-andamento' || r.status === 'pending' || r.status === 'pendente').length);
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        setCompletedThisMonth(data.filter(r => {
          const created = r.created_at ? new Date(r.created_at) : null;
          return (r.status === 'concluido' || r.status === 'completed') && created && created >= firstDay;
        }).length);
        setUpcomingEvents(data.filter(r => r.due_date && new Date(r.due_date) > new Date()));
      }
      setLoading(false);
    };
    fetchRequests();
  }, [user]);

  const getRequestStatusName = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in-progress':
        return 'Em andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const clientPieChartData = [
    { name: 'Ativas', value: activeCount },
    { name: 'Concluídas Este Mês', value: completedThisMonth },
  ];

  const CLIENT_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Meu Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe suas solicitações e compromissos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Solicitações Ativas
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {activeCount}
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
                  {completedThisMonth}
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
                  {upcomingEvents.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Visão Geral das Minhas Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientPieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {clientPieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CLIENT_COLORS[index % CLIENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} solicitações`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Minhas Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRequests.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada</p>
              ) : (
                myRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {request.type}
                      </h4>
                      <Badge className={getStatusColor(request.status)}>
                        {getRequestStatusName(request.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {request.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Criado em {request.created_at ? format(new Date(request.created_at), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                    </p>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/client/requests')}>
              Ver Todas as Solicitações
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Próximos Compromissos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nenhum compromisso futuro</p>
              ) : (
                upcomingEvents.map((event, index) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {event.due_date ? format(new Date(event.due_date), 'dd/MM/yyyy', { locale: ptBR }) : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/client/calendar')}>
              Ver Calendário Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
