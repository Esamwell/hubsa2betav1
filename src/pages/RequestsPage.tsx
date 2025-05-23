import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  FileText,
  Calendar,
  CalendarIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

type Request = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  due_date: string | null;
  client_id: string;
  created_at: string;
  clients?: {
    name: string;
    email: string;
  };
};

type Client = {
  id: string;
  name: string;
  email: string;
};

const formSchema = z.object({
  title: z.string().min(2, { message: "Título deve ter pelo menos 2 caracteres" }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Selecione um tipo de solicitação" }),
  client_id: z.string().uuid({ message: "Cliente inválido" }),
  due_date: z.date().optional(),
});

const requestTypes = [
  { value: "post", label: "Postagem para Redes Sociais" },
  { value: "card", label: "Card de Produto" },
  { value: "video", label: "Edição de Vídeo" },
  { value: "design", label: "Design Gráfico" },
  { value: "other", label: "Outro" },
];

const RequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      client_id: "",
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients for the dropdown
      const clientsResponse = await supabase
        .from('clients')
        .select('id, name, email')
        .order('name', { ascending: true });

      if (clientsResponse.error) {
        throw clientsResponse.error;
      }

      // Fetch requests with client information
      let requestsQuery = supabase
        .from('requests')
        .select(`
          *,
          clients (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // If user is a client, only fetch their requests
      if (user?.role === 'client' && user.clientId) {
        requestsQuery = requestsQuery.eq('client_id', user.clientId);
      }

      const { data: requestsData, error: requestsError } = await requestsQuery;

      if (requestsError) {
        throw requestsError;
      }

      setClients(clientsResponse.data || []);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredRequests = requests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.clients?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRequest = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([
          { 
            title: values.title, 
            description: values.description || null,
            type: values.type,
            client_id: values.client_id,
            due_date: values.due_date ? values.due_date.toISOString() : null,
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação criada",
        description: "A solicitação foi criada com sucesso.",
      });

      setOpenDialog(false);
      form.reset();
      fetchData();

    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a solicitação.",
        variant: "destructive",
      });
    }
  };

  const getRequestTypeName = (type: string) => {
    const requestType = requestTypes.find(rt => rt.value === type);
    return requestType ? requestType.label : type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pendente</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Em andamento</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const pageTitle = user?.role === 'client' ? 'Minhas Solicitações' : 'Solicitações';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {pageTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie as solicitações e acompanhe o status
          </p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              <FileText className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova solicitação.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateRequest)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da solicitação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {requestTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.role === 'admin' && (
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva a solicitação em detalhes..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between p-6">
          <div>
            <CardTitle>Lista de Solicitações</CardTitle>
            <CardDescription>
              {filteredRequests.length} solicitações encontradas
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar solicitação..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchData()}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Atualizar</span>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Filtrar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma solicitação encontrada
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    {user?.role === 'admin' && <TableHead>Cliente</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Entrega</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{getRequestTypeName(request.type)}</TableCell>
                      {user?.role === 'admin' && (
                        <TableCell>{request.clients?.name || '-'}</TableCell>
                      )}
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.due_date ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {formatDate(request.due_date)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsPage;
