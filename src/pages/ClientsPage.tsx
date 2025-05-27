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
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, RefreshCw, UserPlus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Check } from 'lucide-react';

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  created_at: string;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      password: "",
    },
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateClient = async (values: z.infer<typeof formSchema>) => {
    try {
      // 1. Criar cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone || null,
            company: values.company || null,
          }
        ])
        .select();

      if (clientError || !clientData || !clientData[0]) {
        throw clientError || new Error('Erro ao criar cliente');
      }

      // 2. Criar usuário vinculado ao cliente
      const clientId = clientData[0].id;
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(values.password, 10);

      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            email: values.email,
            password: passwordHash,
            name: values.name,
            role: 'client',
            client_id: clientId,
          }
        ]);

      if (userError) {
        // rollback: remover cliente criado se usuário falhar
        await supabase.from('clients').delete().eq('id', clientId);
        throw userError;
      }

      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });

      setOpenDialog(false);
      form.reset();
      fetchClients();
    } catch (error: any) {
      console.error('Error creating client:', error);
      let errorMessage = "Não foi possível criar o cliente.";
      if (error.message && error.message.includes('duplicate key')) {
        errorMessage = "Este email já está cadastrado.";
      }
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleOpenDetails = (client: Client) => {
    setSelectedClient(client);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
    setOpenDetails(false);
  };

  const handleUpdateClient = async (values: Partial<Client>, newPassword?: string) => {
    if (!selectedClient) return;
    try {
      // Atualizar cliente
      const { error: clientError } = await supabase
        .from('clients')
        .update(values)
        .eq('id', selectedClient.id);
      if (clientError) {
        console.error('Erro ao atualizar cliente:', clientError);
        throw clientError;
      }

      // Atualizar usuário vinculado (nome, email, senha)
      if (values.name || values.email || newPassword) {
        let updateUser: any = {
          name: values.name || selectedClient.name,
          email: values.email || selectedClient.email,
        };
        if (newPassword && newPassword.length >= 6) {
          const bcrypt = await import('bcryptjs');
          updateUser.password = await bcrypt.hash(newPassword, 10);
        }
        const { error: userError } = await supabase
          .from('users')
          .update(updateUser)
          .eq('client_id', selectedClient.id);
        if (userError) {
          console.error('Erro ao atualizar usuário vinculado:', userError);
          throw userError;
        }
      }

      toast({ title: 'Cliente atualizado', description: 'As informações foram salvas.' });
      fetchClients();
      handleCloseDetails();
    } catch (error: any) {
      console.error('Erro geral ao atualizar cliente:', error);
      toast({ title: 'Erro', description: error.message || 'Não foi possível atualizar o cliente.', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedClient) return;
    const newStatus = selectedClient.status === 'active' ? 'inactive' : 'active';
    await handleUpdateClient({ status: newStatus });
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', selectedClient.id);
      if (error) throw error;
      toast({ title: 'Cliente excluído', description: 'O cliente foi removido.' });
      fetchClients();
      handleCloseDetails();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir o cliente.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus clientes e suas informações
          </p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-xl">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo cliente.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateClient)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Senha do cliente" {...field} />
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
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {filteredClients.length} clientes cadastrados
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchClients()}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Atualizar</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Filtrar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="flex flex-col gap-1">
                  <button className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${statusFilter === 'all' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setStatusFilter('all')}>
                    {statusFilter === 'all' && <Check className="w-4 h-4" />} Todos
                  </button>
                  <button className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${statusFilter === 'active' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setStatusFilter('active')}>
                    {statusFilter === 'active' && <Check className="w-4 h-4" />} Ativos
                  </button>
                  <button className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${statusFilter === 'inactive' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setStatusFilter('inactive')}>
                    {statusFilter === 'inactive' && <Check className="w-4 h-4" />} Inativos
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Nenhum cliente encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.company || '-'}</TableCell>
                      <TableCell>{client.phone || '-'}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(client)}>
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

      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Visualize e edite as informações do cliente.</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <form
              className="space-y-6 py-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updateData: any = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  company: formData.get('company') as string,
                };
                const newPassword = formData.get('newPassword') as string;
                await handleUpdateClient(updateData, newPassword);
              }}
            >
              {/* Seção de Informações do Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" defaultValue={selectedClient.name} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" defaultValue={selectedClient.email} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" defaultValue={selectedClient.phone || ''} className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" name="company" defaultValue={selectedClient.company || ''} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" name="newPassword" type="password" placeholder="Deixe em branco para não alterar" autoComplete="new-password" className="mt-1" />
                  </div>
                   {/* Campo de Status (pode ser adicionado aqui ou em outra seção se necessário) */}
                   {/* No exemplo original, o status não é um campo editável diretamente aqui, mas um botão toggle. Manteremos como botão por enquanto. */}
                </div>
              </div>

              {/* Botões de Ação */}
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                 <Button
                   type="button"
                   variant={selectedClient.status === 'active' ? 'outline' : 'default'}
                   onClick={handleToggleStatus}
                 >
                   {selectedClient.status === 'active' ? 'Marcar como Inativo' : 'Marcar como Ativo'}
                 </Button>
                 <Button type="submit" variant="default">Salvar Alterações</Button>
                 <Button type="button" variant="destructive" onClick={handleDeleteClient}>Excluir</Button>
                 {/* Botão de fechar fora do formulário */}
              </DialogFooter>
            </form>
          )}
           {/* Botão de fechar fora do formulário */}
           <DialogFooter>
             <Button type="button" variant="outline" onClick={handleCloseDetails}>
               Fechar
             </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
