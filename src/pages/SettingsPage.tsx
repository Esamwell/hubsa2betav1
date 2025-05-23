
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'Empresa ABC',
    phone: '(11) 98765-4321'
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    statusChanges: true,
    newMessages: true,
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };
  
  const handleSavePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não conferem.",
        variant: "destructive",
      });
      return;
    }
    
    if (!security.currentPassword || !security.newPassword) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi alterada com sucesso.",
    });
    
    setSecurity({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas preferências e informações da conta
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="theme-mode">Modo Escuro</Label>
          <Switch
            id="theme-mode"
            checked={isDark}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize seus dados pessoais e de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={profile.name} 
                  onChange={handleProfileChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profile.email}
                  onChange={handleProfileChange}
                  disabled={user?.role === 'client'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input 
                  id="company" 
                  name="company" 
                  value={profile.company}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
          </CardFooter>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receba atualizações por email
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Notificações no Navegador</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receba notificações push
                </p>
              </div>
              <Switch 
                id="browser-notifications" 
                checked={notifications.browser}
                onCheckedChange={(checked) => handleNotificationChange('browser', checked)}
              />
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="status-notifications">Mudanças de Status</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quando uma tarefa mudar de status
                </p>
              </div>
              <Switch 
                id="status-notifications" 
                checked={notifications.statusChanges}
                onCheckedChange={(checked) => handleNotificationChange('statusChanges', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="message-notifications">Novas Mensagens</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quando receber uma nova mensagem
                </p>
              </div>
              <Switch 
                id="message-notifications" 
                checked={notifications.newMessages}
                onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => toast({ title: "Configurações salvas" })}>
              Salvar Preferências
            </Button>
          </CardFooter>
        </Card>
        
        {/* Security Settings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie sua senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input 
                  id="current-password" 
                  name="currentPassword" 
                  type="password"
                  value={security.currentPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input 
                  id="new-password" 
                  name="newPassword" 
                  type="password"
                  value={security.newPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input 
                  id="confirm-password" 
                  name="confirmPassword" 
                  type="password"
                  value={security.confirmPassword}
                  onChange={handleSecurityChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePassword}>Atualizar Senha</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
