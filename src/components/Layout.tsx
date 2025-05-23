import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - visível em telas grandes, controlada por toggle em telas pequenas */}
      <div className={
        `fixed lg:static h-screen transition-transform duration-300 ease-in-out ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 lg:w-64'} z-30`
      }>
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
      
      {/* Overlay para telas pequenas quando a sidebar está aberta */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        >
        </div>
      )}

      {/* Conteúdo principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out`}>
        <Topbar onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} /> {/* Passar função para toggle */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
