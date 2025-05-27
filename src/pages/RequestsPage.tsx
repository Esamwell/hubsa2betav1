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
  X
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
  client_id: z.string().uuid({ message: "Cliente inválido" }).optional(),
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
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Novos estados para filtros
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      client_id: user?.role === 'admin' ? "" : undefined,
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

      // Se usuário for cliente, filtrar por client_id
      if (user?.role === 'client' && user.client_id) {
        requestsQuery = requestsQuery.eq('client_id', user.client_id);
      }

      // Aplicar filtros de tipo e status, se selecionados
      if (filterType) {
        requestsQuery = requestsQuery.eq('type', filterType);
      }
      if (filterStatus) {
        requestsQuery = requestsQuery.eq('status', filterStatus);
      }

      // Aplicar filtro de busca no título, tipo ou nome do cliente (case-insensitive)
      if (searchTerm) {
           requestsQuery = requestsQuery.or(
            `title.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%,clients.name.ilike.%${searchTerm}%`
           );
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
  }, [user, filterType, filterStatus]);

  const handleCreateRequest = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Valores do formulário:', values);
      console.log('Usuário logado:', user);
      // Adiciona o client_id do usuário logado se ele for um cliente
      const requestData = user?.role === 'client' && user.client_id
        ? { ...values, client_id: user.client_id } // Inclui client_id para clientes
        : values; // Usa valores originais para admins (onde o campo client_id existe no form)

      console.log('Dados da solicitação para inserção:', requestData);

      const { data, error } = await supabase
        .from('requests')
        .insert([
          { 
            title: requestData.title, 
            description: requestData.description || null,
            type: requestData.type,
            client_id: requestData.client_id,
            due_date: requestData.due_date ? requestData.due_date.toISOString() : null,
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

  const handleOpenDetails = (request: Request) => {
    setSelectedRequest(request);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
    setOpenDetails(false);
  };

  const handleUpdateRequest = async (values: Partial<Request>) => {
    if (!selectedRequest) return;

    try {
      setLoading(true);

      const formData = new FormData(document.getElementById(`request-details-form-${selectedRequest.id}`) as HTMLFormElement);

      const updatedValues: Partial<Request> = {
        title: formData.get('title') as string,
        type: formData.get('type') as string,
        description: formData.get('description') as string || null,
        status: formData.get('status') as string,
      };

      // Lidar com a data de entrega explicitamente
      const formDueDateString = formData.get('due_date') as string;
      const originalDueDateString = selectedRequest.due_date ? format(new Date(selectedRequest.due_date), 'yyyy-MM-dd') : ''; // Formato do input date

      // Incluir due_date na atualização apenas se for alterada ou se for limpa
      if (formDueDateString !== originalDueDateString) {
          if (formDueDateString) {
              // Se o valor no formulário é diferente do original e não está vazio, atualiza para o novo valor
               updatedValues.due_date = new Date(formDueDateString).toISOString();
           } else {
              // Se o valor no formulário é diferente do original e está vazio, define como null (removendo a data)
              updatedValues.due_date = null;
          }
      }
      // Se formDueDateString === originalDueDateString, não adicionamos due_date a updatedValues, preservando o valor existente no DB.


      // Adiciona client_id apenas se for admin
        if (user?.role === 'admin') {
         updatedValues.client_id = formData.get('client_id') as string;
      }

      // Verificar se há actually any changes to avoid unnecessary updates
      // (Opcional, mas boa prática)
      const hasChanges = Object.keys(updatedValues).some(key => {
          // Comparação básica, pode precisar ser mais robusta para objetos aninhados ou datas
          // Para datas, já tratamos acima, então esta verificação seria mais para outros campos
          if (key === 'due_date') {
              // Já tratamos a lógica da data acima, não precisamos comparar aqui novamente
              return false;
          }
           // Comparar outros campos lidos do formulário com os valores originais
          // Nota: formData.get() retorna string, selectedRequest[key] pode ter outro tipo
          // Seria ideal comparar os valores no mesmo formato ou usar um estado local para o formulário
          // Para simplificar agora, focaremos apenas na lógica da data já implementada.
          return false; // Manter como false por enquanto para não complicar a comparação de outros campos
      });

      // Se formDueDateString !== originalDueDateString, due_date já foi adicionado a updatedValues.
      // Se formDueDateString === originalDueDateString, updatedValues.due_date não existe, preservando o DB value.

      // Se não houver outras mudanças e a data não foi alterada/removida, não faz a chamada ao Supabase
      if (Object.keys(updatedValues).length === 0) {
           console.log("Nenhuma alteração detectada, cancelando atualização.");
           setLoading(false);
           setOpenDetails(false);
           return; // Sai da função se não houver alterações
      }


      const { data, error } = await supabase
        .from('requests')
        .update(updatedValues)
        .eq('id', selectedRequest.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação atualizada",
        description: "As alterações foram salvas com sucesso.",
      });

      setOpenDetails(false);
      fetchData(); // Recarregar dados para refletir a mudança

    } catch (error: any) {
      console.error('Erro ao atualizar solicitação:', error);
      toast({ title: 'Erro', description: error.message || 'Não foi possível atualizar a solicitação.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', selectedRequest.id);
      if (error) throw error;

      toast({ title: 'Solicitação excluída', description: 'A solicitação foi removida.' });
      fetchData(); // Atualiza a lista
      handleCloseDetails();
    } catch (error: any) {
      console.error('Erro ao excluir solicitação:', error);
      toast({ title: 'Erro', description: error.message || 'Não foi possível excluir a solicitação.', variant: 'destructive' });
    }
  };

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
              <form onSubmit={form.handleSubmit(
                handleCreateRequest,
                (errors) => { // Adiciona um handler para erros de validação
                  console.error('Erros de validação do formulário:', JSON.stringify(errors, null, 2));
                }
              )} className="space-y-4 py-4">
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
              {requests.length} solicitações encontradas
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

            {/* Dropdown de Filtro por Tipo */}
            <Select onValueChange={setFilterType} value={filterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>Todos os Tipos</SelectItem>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dropdown de Filtro por Status */}
            <Select onValueChange={setFilterStatus} value={filterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value={undefined}>Todos os Status</SelectItem>
                 {['pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
                   <SelectItem key={status} value={status}>
                     {status === 'pending' ? 'Pendente' :
                      status === 'in-progress' ? 'Em andamento' :
                      status === 'completed' ? 'Concluído' :
                      'Cancelado'}
                   </SelectItem>
                 ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => fetchData()}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Atualizar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : requests.length === 0 ? (
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
                  {requests.map((request) => (
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
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(request)}>
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

      {/* Modal de detalhes da solicitação */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="sm:max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>Visualize e edite os detalhes da solicitação.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <form id={`request-details-form-${selectedRequest.id}`} onSubmit={(e) => {
              e.preventDefault();
              // Coletar dados do formulário manualmente ou usar react-hook-form se integrado
              const formData = new FormData(e.currentTarget);
              const updatedValues: Partial<Request> = {
                title: formData.get('title') as string,
                type: formData.get('type') as string,
                description: formData.get('description') as string || null,
                status: formData.get('status') as string,
              };

              const formDueDateString = formData.get('due_date') as string;
              const originalDueDateString = selectedRequest.due_date ? format(new Date(selectedRequest.due_date), 'yyyy-MM-dd') : '';

              if (formDueDateString !== originalDueDateString) {
                  if (formDueDateString) {
                      updatedValues.due_date = new Date(formDueDateString).toISOString();
                   } else {
                      updatedValues.due_date = null;
                  }
              }

               if (user?.role === 'admin') {
                updatedValues.client_id = formData.get('client_id') as string;
             }
              
              handleUpdateRequest(updatedValues);
            }}>
              {/* Seção de Informações Principais */}
              <div className="space-y-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Informações Principais</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" name="title" defaultValue={selectedRequest.title} required readOnly={user?.role !== 'admin'} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select name="type" defaultValue={selectedRequest.type} onValueChange={(value) => {
                          // Atualizar o valor do formulário manualmente ou usar estado
                      }} disabled={user?.role !== 'admin'}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {requestTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>

                   {user?.role === 'admin' && ( // Campo cliente apenas para admin
                    <div>
                      <Label htmlFor="client_id">Cliente</Label>
                      <Select name="client_id" defaultValue={selectedRequest.client_id} onValueChange={(value) => {
                        // Atualizar o valor do formulário manualmente ou usar estado
                    }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                   )}
                 </div>
              </div>

              {/* Seção de Detalhes Adicionais */}
              <div className="space-y-6 mb-6">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Detalhes Adicionais</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="due_date">Data de Entrega</Label>
                      <Input type="date" id="due_date" name="due_date" defaultValue={selectedRequest.due_date ? format(new Date(selectedRequest.due_date), 'yyyy-MM-dd') : ''} readOnly={user?.role !== 'admin'} className="mt-1" />
                    </div>

                     {user?.role === 'admin' && ( // Campo status apenas para admin
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={selectedRequest.status} onValueChange={(value) => {
                          // Atualizar o valor do formulário manualmente ou usar estado
                          // Você pode usar um estado local para controlar isso se necessário
                      }}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            {['pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
                              <SelectItem key={status} value={status}>
                                {status === 'pending' ? 'Pendente' :
                                 status === 'in-progress' ? 'Em andamento' :
                                 status === 'completed' ? 'Concluído' :
                                 'Cancelado'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                         </div>
                       )}
                 </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" name="description" defaultValue={selectedRequest.description || ''} className="resize-none min-h-[150px] mt-1" readOnly={user?.role !== 'admin'} />
                </div>
              </div>

               {/* Botões de ação */}
               {user?.role === 'admin' && (
                 <DialogFooter className="pt-4">
                   <Button type="button" variant="destructive" onClick={handleDeleteRequest}>Excluir</Button>
                   <Button type="submit" variant="default">Salvar Alterações</Button>
                 </DialogFooter>
               )}
            </form>
          )}
           {/* Botão de fechar fora do formulário */}
           <DialogFooter>
             <Button type="button" variant="outline" onClick={handleCloseDetails}><X className="w-4 h-4" /></Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsPage;
