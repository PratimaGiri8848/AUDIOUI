import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Copy, Play, Trash2, 
  Search, ChevronDown, ChevronUp,
  Upload, ExternalLink, Loader2
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { formatDate, truncateText } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryItem {
  id: number;
  voice: {
    name: string;
    code: string;
  };
  text: string;
  pageUrl: string;
  audioUrl: string;
  createdDate: string;
  listens: number;
}

// Simulate fetching data from an API
const fetchHistoryData = async (page: number, limit: number = 20): Promise<HistoryItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const startId = (page - 1) * limit + 1;
  return Array.from({ length: limit }, (_, index) => ({
    id: startId + index,
    voice: { 
      name: Math.random() > 0.5 ? 'Prasanna' : 'Rija', 
      code: 'NP' 
    },
    text: `Sample text for history item ${startId + index}. This is a longer piece of text that demonstrates how the content will be displayed in the table.`,
    pageUrl: `https://example.com/page${startId + index}`,
    audioUrl: `https://audio.example.com/audio${startId + index}.mp3`,
    createdDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    listens: Math.floor(Math.random() * 200)
  }));
};

const HistoryTab: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{field: keyof HistoryItem | null, direction: 'asc' | 'desc'}>({
    field: 'createdDate',
    direction: 'desc'
  });
  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const newData = await fetchHistoryData(page);
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setHistoryData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading history data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (!loadingRef.current) return;

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    observer.current.observe(loadingRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreData, hasMore]);

  useEffect(() => {
    loadMoreData();
  }, []);
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setHistoryData(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleUpload = (id: number, file: File) => {
    console.log(`Uploading file ${file.name} for item ${id}`);
  };
  
  const handlePlayAudio = (url: string) => {
    console.log(`Playing audio from ${url}`);
  };
  
  const sortData = (field: keyof HistoryItem) => {
    const newDirection = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, direction: newDirection });
    
    const sortedData = [...historyData].sort((a, b) => {
      if (field === 'listens') {
        return sortBy.direction === 'asc' 
          ? a.listens - b.listens 
          : b.listens - a.listens;
      } else if (field === 'createdDate') {
        return sortBy.direction === 'asc'
          ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
      return 0;
    });
    
    setHistoryData(sortedData);
  };

  const filteredData = historyData.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pageUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortIcon = ({ field }: { field: keyof HistoryItem }) => {
    if (sortBy.field !== field) return <ChevronDown className="opacity-30\" size={14} />;
    return sortBy.direction === 'asc' 
      ? <ChevronUp size={14} /> 
      : <ChevronDown size={14} />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Audio History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search history..."
            className="input pl-9 py-1 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-12">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-24">
                  <button 
                    className="flex items-center"
                    onClick={() => sortData('voice')}
                  >
                    Voice <SortIcon field="voice" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Text</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-48">Page URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-48">Audio URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-32">
                  <button 
                    className="flex items-center"
                    onClick={() => sortData('createdDate')}
                  >
                    Created <SortIcon field="createdDate" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-32">
                  <button 
                    className="flex items-center"
                    onClick={() => sortData('listens')}
                  >
                    Listens <SortIcon field="listens" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{item.voice.name}</div>
                      <div className="text-xs text-muted-foreground">({item.voice.code})</div>
                    </td>
                    <td className="px-4 py-3">
                      <div 
                        className="text-sm cursor-help max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={item.text}
                      >
                        {truncateText(item.text, 80)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={item.pageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {truncateText(item.pageUrl, 30)}
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={item.audioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {truncateText(item.audioUrl, 30)}
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.createdDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-center">{item.listens}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <label className="cursor-pointer text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">
                          <Upload size={16} />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="audio/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUpload(item.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        <button 
                          className="text-primary hover:text-primary/80"
                          onClick={() => handlePlayAudio(item.audioUrl)}
                          aria-label="Play audio"
                        >
                          <Play size={16} />
                        </button>
                        <button 
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {loading && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}
          
          <div ref={loadingRef} style={{ height: '20px' }} />
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;