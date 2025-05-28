import React, { useState } from 'react';
import { Switch } from '../../ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Slider } from '../../ui/Slider';
import { Card, CardContent } from '../../ui/Card';
import { Info, AlertTriangle, Play, Rewind, FastForward, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
  // General settings
  const [sessionization, setSessionization] = useState(false);
  const [autoconvert, setAutoconvert] = useState(true);
  
  // Voice settings
  const [autoselectVoice, setAutoselectVoice] = useState(true);
  const [voiceProvider, setVoiceProvider] = useState("11Labs");
  const [language, setLanguage] = useState("English");
  const [gender, setGender] = useState("Male");
  const [defaultVoice, setDefaultVoice] = useState("Rachel");
  const [defaultModel, setDefaultModel] = useState("Eleven Multilingual v2");
  
  // Text and Image settings
  const [showTitle, setShowTitle] = useState(true);
  const [title, setTitle] = useState("Audio by ElevenLabs");
  const [showAuthor, setShowAuthor] = useState(true);
  const [author, setAuthor] = useState("Sascha Meier");
  const [imageUrl, setImageUrl] = useState("");
  
  // Appearance settings
  const [smallPlayer, setSmallPlayer] = useState(true);
  const [volumeControl, setVolumeControl] = useState(true);
  const [rewindForward, setRewindForward] = useState(true);
  const [speedControl, setSpeedControl] = useState(true);
  const [textColor, setTextColor] = useState("#2134c2ff");
  const [bgColor, setBgColor] = useState("#000000ff");
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = 30; // Example progress percentage

  return (
    <div className="space-y-4">
      <Section title="General">
        <SettingRow label="Sessionization" hasInfo>
          <Switch checked={sessionization} onCheckedChange={setSessionization} />
        </SettingRow>
        <SettingRow label="Autoconvert project to audio" hasInfo>
          <Switch checked={autoconvert} onCheckedChange={setAutoconvert} />
        </SettingRow>
      </Section>
      
      <Section title="Voice">
        <SettingRow label="Autoselect authors voice" hasInfo>
          <Switch checked={autoselectVoice} onCheckedChange={setAutoselectVoice} />
        </SettingRow>
        
        <SettingRow label="Voice Provider" hasInfo>
          <Select value={voiceProvider} onValueChange={setVoiceProvider}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="11Labs">11Labs</SelectItem>
              <SelectItem value="OpenAI">OpenAI</SelectItem>
              <SelectItem value="PlayHT">PlayHT</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        
        <SettingRow label="Language" hasInfo>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        
        <SettingRow label="Gender" hasInfo>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Robot">Robot</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        
        <SettingRow label="Default Voice" hasInfo>
          <Select value={defaultVoice} onValueChange={setDefaultVoice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rachel">Rachel</SelectItem>
              <SelectItem value="John">John</SelectItem>
              <SelectItem value="Sarah">Sarah</SelectItem>
              <SelectItem value="Michael">Michael</SelectItem>
              <SelectItem value="Emma">Emma</SelectItem>
              <SelectItem value="David">David</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        
        <SettingRow label="Default Model">
          <Select value={defaultModel} onValueChange={setDefaultModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Eleven Multilingual v1">Eleven Multilingual v1</SelectItem>
              <SelectItem value="Eleven Multilingual v2">Eleven Multilingual v2</SelectItem>
              <SelectItem value="Eleven Turbo v2">Eleven Turbo v2</SelectItem>
              <SelectItem value="Eleven Flash v2">Eleven Flash v2</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        
        <div className="flex items-start p-4 mt-3 mb-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800 text-sm">
          <AlertTriangle className="text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5 flex-shrink-0" size={16} />
          <div className="text-yellow-800 dark:text-yellow-400">
            We recommend switching to the <strong>Eleven Multilingual v2</strong> model to get the best possible quality for this voice.
          </div>
        </div>
      </Section>
      
      <Section title="Text and Image">
        <SettingRow label="Show Title" hasInfo>
          <Switch checked={showTitle} onCheckedChange={setShowTitle} />
        </SettingRow>
        
        {showTitle && (
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1">Title</label>
            <input 
              type="text" 
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        )}
        
        <SettingRow label="Show Author" hasInfo>
          <Switch checked={showAuthor} onCheckedChange={setShowAuthor} />
        </SettingRow>
        
        {showAuthor && (
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1">Author</label>
            <input 
              type="text" 
              className="input w-full"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-1">Image URL</label>
          <input 
            type="text" 
            className="input w-full"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </Section>
      
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
                  {title} ~ {author}
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