import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ChevronDown, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  onSidebarToggle: () => void;
}

const Topbar = ({ onSidebarToggle }: TopbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/settings');
    } else if (user?.role === 'client') {
      navigate('/client/settings');
    }
  };

  return (
    <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4">
      {/* Esquerda: Logo e Botão para mobile sidebar toggle */}
      <div className="flex items-center space-x-2">
        {/* Botão para mobile sidebar toggle - visível apenas em telas pequenas */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-4 h-4" />
        </Button>
        {/* Logo - visível em telas grandes, e também em mobile */}
        <img src="/images/logosa2hub.png" alt="Logo HubSA2" className="h-8 w-auto" />
      </div>

      {/* Espaço flexível para empurrar itens para a direita */}
      <div className="flex-grow"></div>

      {/* Direita: Ícones de Mensagem e Avatar/Usuário */}
      <div className="flex items-center space-x-4">
        {/* Ícones de Mensagem */}
        <div className="flex items-center space-x-4 mr-2 md:mr-6">
          <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 cursor-pointer" />
        </div>

        {/* Avatar e Nome do Usuário com Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar>
                <AvatarImage src="" alt="Avatar" />{/* Adicionar lógica para foto do usuário se existir */}
                <AvatarFallback>{user?.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-800 dark:text-white hidden md:block">{user?.name || 'Usuário'}</span>
              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'Meu Perfil'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettingsClick}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar; 