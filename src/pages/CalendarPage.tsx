import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CalendarPage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [filter, setFilter] = useState<string>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [datesWithEvents, setDatesWithEvents] = useState<Date[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      let query = supabase.from('requests').select('*');
      if (user?.role === 'client' && user.client_id) {
        query = query.eq('client_id', user.client_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        setEvents(data.map(ev => ({
          ...ev,
          date: ev.due_date ? new Date(ev.due_date) : null
        })));
        // Extract dates with events
        const dates = data
          .filter(ev => ev.due_date)
          .map(ev => new Date(ev.due_date));
        setDatesWithEvents(dates);
      }
    };
    fetchEvents();
  }, [user]);

  // Filter events based on the selected date and filter option
  const filteredEvents = events.filter(event => {
    // Filter by date if in calendar view and a date is selected
    const dateMatches = !date ||
      (event.date && event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear());
    // Filter by type/status
    const typeMatches = filter === 'all' ||
      event.type === filter ||
      event.status === filter;
    return dateMatches && typeMatches;
  });

  const displayDate = date ? format(date, "MMMM yyyy", { locale: ptBR }) : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Calendário</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e gerencie as atividades e prazos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="post">Posts</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="video">Vídeos</SelectItem>
              <SelectItem value="scheduled">Agendados</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              onClick={() => setView('calendar')}
              size="sm"
            >
              <CalendarIcon className="h-4 w-4 mr-1" /> Calendário
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
              size="sm"
            >
              Lista
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Calendar section */}
        {view === 'calendar' && (
          <>
            {/* Calendar widget */}
            <Card className="xl:col-span-4">
              <CardHeader>
                <CardTitle>
                  {displayDate}
                </CardTitle>
                <CardDescription>
                  Selecione uma data para ver as atividades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  className="p-3 pointer-events-auto w-full"
                  classNames={{
                    root: "w-full",
                    day_today: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
                    day_selected: "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                  }}
                  datesWithEvents={datesWithEvents}
                />
              </CardContent>
            </Card>
            {/* Events for selected date */}
            <div className="xl:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione uma data'}
                  </CardTitle>
                  <CardDescription>
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'atividade' : 'atividades'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length === 0 ? (
                    <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Nenhuma atividade para esta data
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map(event => (
                        <div key={event.id} className="flex items-start p-3 rounded-lg border bg-white dark:bg-gray-800">
                          <div className="flex-1">
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {event.date ? format(event.date, "dd/MM/yyyy") : ''}
                            </p>
                          </div>
                          <div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                event.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                              {event.status === 'completed' ? 'Concluído' :
                                event.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
        {/* List view */}
        {view === 'list' && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Todas as Atividades</CardTitle>
              <CardDescription>
                {filteredEvents.length} {filteredEvents.length === 1 ? 'atividade' : 'atividades'} {filter !== 'all' ? 'filtradas' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Nenhuma atividade encontrada
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.sort((a, b) => a.date?.getTime() - b.date?.getTime()).map(event => (
                    <div key={event.id} className="flex items-center p-3 rounded-lg border bg-white dark:bg-gray-800">
                      <div className="flex-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {event.date ? format(event.date, "dd/MM/yyyy") : ''}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {event.type === 'post' ? 'Post' :
                              event.type === 'design' ? 'Design' :
                                event.type === 'video' ? 'Vídeo' : 'Outro'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            event.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                          {event.status === 'completed' ? 'Concluído' :
                            event.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
