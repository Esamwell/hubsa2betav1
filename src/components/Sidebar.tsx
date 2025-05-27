import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Calendar, 
  Bell, 
  Menu, 
  Moon, 
  Sun, 
  User,
  Settings,
  Bell as BellIcon,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const adminMenuItems = [
    { title: 'Dashboard', path: '/admin', icon: Calendar },
    { title: 'Clientes', path: '/admin/clients', icon: User },
    { title: 'Solicitações', path: '/admin/requests', icon: Bell },
    { title: 'Calendário', path: '/admin/calendar', icon: Calendar },
    { title: 'Configurações', path: '/admin/settings', icon: Settings },
    { title: 'Central de Ajuda', path: '/help', icon: HelpCircle }
  ];

  const clientMenuItems = [
    { title: 'Dashboard', path: '/client', icon: Calendar },
    { title: 'Solicitações', path: '/client/requests', icon: Bell },
    { title: 'Calendário', path: '/client/calendar', icon: Calendar },
    { title: 'Configurações', path: '/client/settings', icon: Settings },
    { title: 'Central de Ajuda', path: '/help', icon: HelpCircle }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div className={cn(
      "h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between w-full">
          {/* Adicionando a Logo */}
          {!isCollapsed && (
            <Link to="/" className="flex items-center">
              <img
                src="/images/logosa2hub.png"
                alt="Logo SA2Hub"
                className="h-12 w-auto"
              />
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin' || item.path === '/client'}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg transition-colors",
                isCollapsed ? "p-2 justify-center" : "space-x-3 p-3",
                "hover:bg-primary-50 dark:hover:bg-gray-800",
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-gray-600 dark:text-gray-300"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="space-y-2 pb-4">
            {/* Informações do usuário */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 text-sm font-medium">{user?.name ? user.name[0] : '?'}</div>
              <div className="text-sm text-gray-800 dark:text-gray-200">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
              </div>
            </div>
            
            {/* Toggle Tema */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="ml-3">Tema {isDark ? 'Claro' : 'Escuro'}</span>
            </Button>
            
            {/* Botão Sair */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-3">Sair</span>
            </Button>
          </div>
        )}
        
        {/* Divisor */}
        {!isCollapsed && <Separator className="my-2" />}
        
        {/* Rodapé customizado */}
        {!isCollapsed && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
            <p>Agência SA2Marketing©</p>
            <p>Versão: BetaV1</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
