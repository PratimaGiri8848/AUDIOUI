import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent } from '../ui/Tabs';
import GeneralTab from './tabs/GeneralTab';
import WebsitesTab from './tabs/WebsitesTab';
import PlayerSettingsTab from './tabs/PlayerSettingsTab';
import HistoryTab from './tabs/HistoryTab';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'general';

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-background border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center p-4 border-b border-border">
          <button 
            className="mr-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        
        <Tabs value={currentTab} className="w-full">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="dashboard" className="p-4">
              {/* Dashboard content will go here */}
              <div className="text-center text-muted-foreground">
                Welcome to your dashboard
              </div>
            </TabsContent>

            <TabsContent value="general" className="p-4">
              <GeneralTab />
            </TabsContent>
            
            <TabsContent value="websites" className="p-4">
              <WebsitesTab />
            </TabsContent>
            
            <TabsContent value="player" className="p-4">
              <PlayerSettingsTab />
            </TabsContent>
            
            <TabsContent value="history" className="p-4">
              <HistoryTab />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;