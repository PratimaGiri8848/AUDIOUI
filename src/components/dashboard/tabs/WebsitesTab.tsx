import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { X, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateUrl } from '../../../lib/utils';

interface TagProps {
  text: string;
  onRemove: () => void;
}

const Tag: React.FC<TagProps> = ({ text, onRemove }) => (
  <div className="flex items-center bg-muted/80 rounded-md px-2 py-1 text-sm">
    <span className="mr-1">{text}</span>
    <button 
      onClick={onRemove} 
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Remove ${text}`}
    >
      <X size={14} />
    </button>
  </div>
);

const WebsitesTab: React.FC = () => {
  const [allowedUrls, setAllowedUrls] = useState<string[]>(["https://elevenlabs.io/blog/"]);
  const [disallowedWords, setDisallowedWords] = useState<string[]>(["admin", "login"]);
  const [disallowedUrls, setDisallowedUrls] = useState<string[]>([]);
  
  const [allowedUrlInput, setAllowedUrlInput] = useState("");
  const [disallowedWordInput, setDisallowedWordInput] = useState("");
  const [disallowedUrlInput, setDisallowedUrlInput] = useState("");
  const [testUrlInput, setTestUrlInput] = useState("");
  const [testResult, setTestResult] = useState<{ allowed: boolean; message: string } | null>(null);
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const addAllowedUrl = () => {
    if (allowedUrlInput && validateUrl(allowedUrlInput)) {
      setAllowedUrls([...allowedUrls, allowedUrlInput]);
      setAllowedUrlInput("");
    }
  };

  const addDisallowedWord = () => {
    if (disallowedWordInput) {
      setDisallowedWords([...disallowedWords, disallowedWordInput]);
      setDisallowedWordInput("");
    }
  };

  const addDisallowedUrl = () => {
    if (disallowedUrlInput && validateUrl(disallowedUrlInput)) {
      setDisallowedUrls([...disallowedUrls, disallowedUrlInput]);
      setDisallowedUrlInput("");
    }
  };

  const removeAllowedUrl = (index: number) => {
    setAllowedUrls(allowedUrls.filter((_, i) => i !== index));
  };

  const removeDisallowedWord = (index: number) => {
    setDisallowedWords(disallowedWords.filter((_, i) => i !== index));
  };

  const removeDisallowedUrl = (index: number) => {
    setDisallowedUrls(disallowedUrls.filter((_, i) => i !== index));
  };

  const testUrl = () => {
    if (!testUrlInput || !validateUrl(testUrlInput)) {
      setTestResult(null);
      return;
    }

    // Check if URL is allowed
    const isAllowed = allowedUrls.some(url => testUrlInput.startsWith(url));
    
    // Check if URL contains disallowed words
    const containsDisallowedWord = disallowedWords.some(word => 
      testUrlInput.toLowerCase().includes(word.toLowerCase())
    );
    
    // Check if URL is in disallowed URLs list
    const isDisallowedUrl = disallowedUrls.includes(testUrlInput);
    
    if (isAllowed && !containsDisallowedWord && !isDisallowedUrl) {
      setTestResult({ allowed: true, message: "URL is allowed" });
    } else {
      setTestResult({ allowed: false, message: "URL is blocked" });
    }
  };

  return (
    <div className="space-y-6">
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">Allowed URLs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add URLs that start with the patterns below. Audio Native will work on any page whose URL starts with these patterns.
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="input flex-1"
            placeholder="https://elevenlabs.io/blog/"
            value={allowedUrlInput}
            onChange={(e) => setAllowedUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAllowedUrl()}
          />
          <Button onClick={addAllowedUrl}>Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {allowedUrls.map((url, index) => (
            <Tag 
              key={index} 
              text={url} 
              onRemove={() => removeAllowedUrl(index)} 
            />
          ))}
        </div>
      </section>
      
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">Disallowed Words</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Audio Native will not work on pages whose URLs contain these words.
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="input flex-1"
            placeholder="admin"
            value={disallowedWordInput}
            onChange={(e) => setDisallowedWordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDisallowedWord()}
          />
          <Button onClick={addDisallowedWord}>Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {disallowedWords.map((word, index) => (
            <Tag 
              key={index} 
              text={word} 
              onRemove={() => removeDisallowedWord(index)} 
            />
          ))}
        </div>
      </section>
      
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">Disallowed URLs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Audio Native will not work on these specific URLs.
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="input flex-1"
            placeholder="https://example.com/private"
            value={disallowedUrlInput}
            onChange={(e) => setDisallowedUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDisallowedUrl()}
          />
          <Button onClick={addDisallowedUrl}>Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {disallowedUrls.map((url, index) => (
            <Tag 
              key={index} 
              text={url} 
              onRemove={() => removeDisallowedUrl(index)} 
            />
          ))}
        </div>
      </section>
      
      <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800 text-sm">
        <AlertTriangle className="text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5 flex-shrink-0" size={16} />
        <div className="text-yellow-800 dark:text-yellow-400">
          <strong>Important:</strong> If you don't restrict domains, anyone could copy your code snippet and use it on their website. Make sure to add your domain to the allowed URLs list.
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Test URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="input flex-1"
              placeholder="https://example.com/page"
              value={testUrlInput}
              onChange={(e) => setTestUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && testUrl()}
            />
            <Button onClick={testUrl}>Test</Button>
          </div>
          
          {testResult && (
            <div className={`mt-3 p-3 rounded-md ${
              testResult.allowed 
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800" 
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}>
              {testResult.allowed ? "✓" : "✗"} {testResult.message}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div 
        className="flex justify-between items-center p-4 bg-muted/30 rounded-md cursor-pointer mt-6"
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
      >
        <span className="font-medium">Advanced Options</span>
        <motion.div
          animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>
      
      {isAdvancedOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-muted/20 rounded-md p-4 mt-2"
        >
          <p className="text-muted-foreground">Additional configuration options will appear here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default WebsitesTab;