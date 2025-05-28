import React, { useState } from 'react';
import { Switch } from '../../ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const GeneralTab: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const iframeCode = `<iframe id="AudioNativeElevenLabsPlayer" width="100%" height="90" frameBorder="no" scrolling="no" src="https://elevenlabs.io/player/index.html?publicUserId=bd605a946c64ae91a6a1969195878d2d89bd42426c8eaca664d92e5d8178&small=true&textColor=rgba(33, 52, 52, 194, 1)&backgroundColor=rgba(255, 25, 25, 255, 1)"></iframe>
<script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">Audio Native enabled</p>
          <p className="text-sm text-muted-foreground">
            Enable or disable the Audio Native functionality on your website
          </p>
        </div>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled} 
          aria-label="Toggle Audio Native"
        />
      </div>
      
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-base">iFrame script</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <pre className="p-4 text-xs bg-black/5 dark:bg-white/5 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
              {iframeCode}
            </pre>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
              aria-label="Copy code"
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div 
        className="flex justify-between items-center p-4 bg-muted/30 rounded-md cursor-pointer mt-8"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">Audio Native Enabled Projects</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-muted/20 rounded-md p-4"
        >
          <p className="text-muted-foreground">No projects enabled yet.</p>
          <Button className="mt-4" variant="outline" size="sm">
            Add Project
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default GeneralTab;