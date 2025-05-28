import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Menu Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-64 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;