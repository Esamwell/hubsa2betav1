import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User, Check, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingRequests: 0,
    projectsThisMonth: 0,
    completedRequests: 0,
    inProgressRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [todayActivities, setTodayActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // Total de clientes
      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });
      // Solicitações pendentes
      const { count: pendingRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      // Projetos do mês
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
      const { count: projectsThisMonth } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDay)
        .lte('created_at', lastDay);
      // Solicitações concluídas
      const { count: completedRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      // Solicitações em andamento
      const { count: inProgressRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in-progress');
      setStats({ totalClients: totalClients || 0, pendingRequests: pendingRequests || 0, projectsThisMonth: projectsThisMonth || 0, completedRequests: completedRequests || 0, inProgressRequests: inProgressRequests || 0 });
    };

    const fetchRecentRequests = async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('id, title, type, status, created_at, clients(name)')
        .order('created_at', { ascending: false })
        .limit(3);
      if (!error && data) {
        setRecentRequests(data);
      }
    };

    const fetchTodayActivities = async () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();
      const { data, error } = await supabase
        .from('requests')
        .select('id, title, due_date, clients(name)')
        .gte('due_date', start)
        .lte('due_date', end)
        .order('due_date', { ascending: true });
      if (!error && data) {
        setTodayActivities(data);
      }
    };

    fetchStats();
    fetchRecentRequests();
    fetchTodayActivities();
    setLoading(false);
  }, []);

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

  // Preparar dados para o gráfico de pizza
  const pieChartData = [
    { name: 'Pendentes', value: stats.pendingRequests },
    { name: 'Em Andamento', value: stats.inProgressRequests },
    { name: 'Concluídas', value: stats.completedRequests },
    // Você pode adicionar Canceladas se quiser incluir no gráfico
    // { name: 'Canceladas', value: stats.cancelledRequests },
  ];

  // Cores para as fatias do gráfico
  const COLORS = ['#FFBB28', '#0088FE', '#00C49F', '#FF8042']; // Amarelo, Azul, Verde, Laranja

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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6">
        {/* Card: Total de Clientes */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Clientes</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalClients}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Card: Solicitações Pendentes */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solicitações Pendentes</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.pendingRequests}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Card: Em Andamento */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Em Andamento</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.inProgressRequests}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Card: Solicitações Concluídas */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solicitações Concluídas</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.completedRequests}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Check className="w-6 h-6 text-green-600" />
              </div>
                </div>
          </CardContent>
        </Card>
        {/* Card: Projetos Este Mês */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projetos Este Mês</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.projectsThisMonth}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Gráfico de Pizza e Solicitações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               Visão Geral das Solicitações
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
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} solicitações`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card: Solicitações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Solicitações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nenhuma solicitação recente</p>
              ) : (
                recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                        {request.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.clients?.name || '-'} • {format(new Date(request.created_at), 'yyyy-MM-dd')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                      {getRequestStatusName(request.status)}
                  </Badge>
                </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/requests')}>
              Ver Todas as Solicitações
            </Button>
          </CardContent>
        </Card>

        {/* Card: Atividades Hoje */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Atividades Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayActivities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade para hoje</p>
              ) : (
                todayActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {activity.title} - {activity.clients?.name || '-'}
                  </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.due_date ? format(new Date(activity.due_date), 'HH:mm') : ''}
                      </p>
                </div>
              </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
