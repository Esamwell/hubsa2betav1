
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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    { title: 'Configurações', path: '/admin/settings', icon: Settings }
  ];

  const clientMenuItems = [
    { title: 'Dashboard', path: '/client', icon: Calendar },
    { title: 'Clientes', path: '/client/clients', icon: User },
    { title: 'Solicitações', path: '/client/requests', icon: Bell },
    { title: 'Calendário', path: '/client/calendar', icon: Calendar },
    { title: 'Configurações', path: '/client/settings', icon: Settings }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div className={cn(
      "h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white">HubSA2</span>
            </div>
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
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors",
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {!isCollapsed && <span className="ml-3">Tema {isDark ? 'Claro' : 'Escuro'}</span>}
        </Button>
        
        {!isCollapsed && (
          <div className="pt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs">{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              Sair
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
