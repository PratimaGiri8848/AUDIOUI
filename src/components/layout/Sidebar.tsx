import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';
import { 
  Settings, History, Globe, Music, 
  LogOut, User, Sun, Moon, X,
  LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  const currentTab = new URLSearchParams(location.search).get('tab') || 'general';

  const handleNavigation = (tab: string) => {
    navigate(`/dashboard?tab=${tab}`);
    onClose();
  };

  const handleLogout = () => {
    signOut();
    navigate('/signin');
    onClose();
  };

  const navigationItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', tab: 'dashboard' },
    { icon: <Settings size={18} />, label: 'General', tab: 'general' },
    { icon: <Globe size={18} />, label: 'My Websites', tab: 'websites' },
    { icon: <Music size={18} />, label: 'Player Settings', tab: 'player' },
    { icon: <History size={18} />, label: 'History', tab: 'history' }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 20 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-80 bg-background border-r border-border md:translate-x-0"
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
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-semibold">Audio Native</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Make audio available as part of your native workflow!
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
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
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between w-full p-4 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            onClick={toggleTheme}
          >
            <span>Theme</span>
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' 
                ? <Sun size={18} className="text-yellow-500" /> 
                : <Moon size={18} className="text-blue-400" />
              }
            </motion.div>
          </motion.button>
        </div>

        {/* Profile */}
        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              {user?.name?.substring(0, 2).toUpperCase() || 'AN'}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Anonymous'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'anonymous@example.com'}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1"
              onClick={() => navigate('/profile')}
            >
              <User size={14} />
              Profile
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-destructive py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;