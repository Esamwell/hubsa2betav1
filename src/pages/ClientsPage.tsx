
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
import { Plus, Search, Filter, RefreshCw, UserPlus } from 'lucide-react';
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
});

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
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

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateClient = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase
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

      if (error) {
        throw error;
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
      if (error.message.includes('duplicate key')) {
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
          <DialogContent className="sm:max-w-md">
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
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum cliente encontrado
              </p>
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

export default ClientsPage;
