
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-10"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
              HubSA2
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sistema de Gestão de Agência
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                Credenciais de teste:
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <p><strong>Admin:</strong> admin@hubsa2.com / admin123</p>
                <p><strong>Cliente:</strong> cliente@exemplo.com / cliente123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
