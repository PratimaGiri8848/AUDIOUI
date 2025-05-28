import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';
import { 
  Settings, History, Globe, Music, 
  LogOut, User, Sun, Moon, X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const currentTab = new URLSearchParams(location.search).get('tab') || 'general';

  const handleNavigation = (tab: string) => {
    navigate(`/dashboard?tab=${tab}`);
    onClose();
  };

  const handleLogout = () => {
    navigate('/signin');
    onClose();
  };

  const navigationItems = [
    { icon: <Settings size={18} />, label: 'General', tab: 'general' },
    { icon: <Globe size={18} />, label: 'My Websites', tab: 'websites' },
    { icon: <Music size={18} />, label: 'Audio Player Settings', tab: 'player' },
    { icon: <History size={18} />, label: 'History', tab: 'history' }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Close button for mobile */}
        <button 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold">Audio Native</h1>
          <p className="text-sm text-muted-foreground">
            Make audio available as part of your native workflow!
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.tab}
              icon={item.icon}
              label={item.label}
              isActive={currentTab === item.tab}
              onClick={() => handleNavigation(item.tab)}
            />
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="absolute bottom-24 w-full px-4">
          <button 
            className="flex items-center justify-between w-full p-2 rounded-md bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            onClick={toggleTheme}
          >
            <span>Theme</span>
            {theme === 'light' 
              ? <Sun size={18} className="text-yellow-500" /> 
              : <Moon size={18} className="text-blue-400" />
            }
          </button>
        </div>

        {/* Profile */}
        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              SM
            </div>
            <div>
              <p className="text-sm font-medium">Sascha Meier</p>
              <p className="text-xs text-muted-foreground">sascha@example.com</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="btn btn-outline py-1 px-3 text-xs flex-1 flex items-center justify-center gap-1"
              onClick={() => handleNavigation('/profile')}
            >
              <User size={14} />
              Profile
            </button>
            <button 
              className="btn btn-destructive py-1 px-3 text-xs flex-1 flex items-center justify-center gap-1"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;