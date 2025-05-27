import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      toast({
        title: "Erro de autenticação",
        description: "Email ou senha incorretos.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Coluna da Esquerda - Fundo Gradiente */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 dark:from-gray-900 dark:to-black items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Bem-vindo de volta!</h2>
          <p className="text-lg text-orange-100">Acesse sua conta HubSA2.</p>
        </div>
      </div>

      {/* Coluna da Direita - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">

        <div className="w-full max-w-md animate-fade-in space-y-6">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="absolute top-4 right-4 z-10 dark:text-gray-300"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-64 h-64 flex items-center justify-center">
              <img src="/images/logosa2hub.png" alt="Logo HubSA2" className="w-full h-full object-contain" />
            </div>
            
            
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2 justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-8">
            © 2025 SA2 Marketing - Todos os direitos reservados | Versão: BetaV1
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
