import React, { useState } from 'react';
import { Switch } from '../../ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Slider } from '../../ui/Slider';
import { Card, CardContent } from '../../ui/Card';
import { Info, AlertTriangle, Play, Rewind, FastForward, Volume2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import { useAuthStore } from '../../../lib/store';

interface SettingRowProps {
  label: string;
  description?: string;
  hasInfo?: boolean;
  children: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, description, hasInfo = false, children }) => (
  <div className="flex items-start justify-between py-3">
    <div className="space-y-1">
      <div className="flex items-center">
        <span className="font-medium">{label}</span>
        {hasInfo && (
          <div className="ml-2 flex items-center justify-center w-4 h-4 rounded-full bg-muted-foreground/30 text-xs">
            <Info size={10} />
          </div>
        )}
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    <div>{children}</div>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 flex items-center justify-center"
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-1">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ColorPicker: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ 
  label, value, onChange 
}) => {
  return (
    <div className="flex-1">
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <input 
        type="text" 
        className="input mb-2 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div 
        className={`h-24 rounded-md cursor-crosshair ${label.includes('Text') ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-gray-900 to-black'}`}
      ></div>
    </div>
  );
};

const PlayerSettingsTab: React.FC = () => {
  const { settings, updateSettings } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize state from settings
  const [smallPlayer, setSmallPlayer] = useState(settings.player.smallPlayer);
  const [volumeControl, setVolumeControl] = useState(settings.player.volumeControl);
  const [rewindForward, setRewindForward] = useState(settings.player.rewindForward);
  const [speedControl, setSpeedControl] = useState(settings.player.speedControl);
  const [textColor, setTextColor] = useState(settings.player.textColor);
  const [bgColor, setBgColor] = useState(settings.player.bgColor);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        player: {
          smallPlayer,
          volumeControl,
          rewindForward,
          speedControl,
          textColor,
          bgColor,
        },
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = 30; // Example progress percentage

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Player Settings</h2>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <Section title="Appearance">
        <SettingRow label="Small Player">
          <Switch checked={smallPlayer} onCheckedChange={setSmallPlayer} />
        </SettingRow>
        
        <SettingRow label="Volume Control" hasInfo>
          <Switch checked={volumeControl} onCheckedChange={setVolumeControl} />
        </SettingRow>
        
        <SettingRow label="Rewind/Forward" hasInfo>
          <Switch checked={rewindForward} onCheckedChange={setRewindForward} />
        </SettingRow>
        
        <SettingRow label="Speed Control" hasInfo>
          <Switch checked={speedControl} onCheckedChange={setSpeedControl} />
        </SettingRow>
        
        <div className="flex gap-4 mt-4">
          <ColorPicker 
            label="Text color" 
            value={textColor} 
            onChange={setTextColor} 
          />
          <ColorPicker 
            label="Background color" 
            value={bgColor} 
            onChange={setBgColor} 
          />
        </div>
        
        {/* Audio Player Preview */}
        <Card className="mt-6 bg-black text-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <button 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <span className="w-3 h-3 border-l-2 border-r-2 border-white"></span>
                ) : (
                  <Play size={16} className="ml-1" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="text-sm mb-1">
                  Audio by ElevenLabs ~ Sascha Meier
                </div>
                
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>00:01</span>
                  <span>00:05</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {rewindForward && <Rewind size={16} className="text-gray-400" />}
                {speedControl && <span className="text-xs text-gray-400">1.0x</span>}
                {rewindForward && <FastForward size={16} className="text-gray-400" />}
                {volumeControl && <Volume2 size={16} className="text-gray-400" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
};

export default PlayerSettingsTab;