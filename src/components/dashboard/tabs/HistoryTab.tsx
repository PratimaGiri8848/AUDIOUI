import React, { useState } from 'react';
import { 
  Copy, Play, Trash2, 
  Search, ChevronDown, ChevronUp,
  Upload, ExternalLink 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { formatDate, truncateText } from '../../../lib/utils';
import { motion } from 'framer-motion';

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

const mockHistoryData: HistoryItem[] = [
  {
    id: 1,
    voice: { name: 'Prasanna', code: 'NP' },
    text: 'अनुमानका कमामा भौतिक संरचनाहरू जीवी हुनका साथै प्रदेशहरू जाँ नेपालमा केन्द्रका प्रदेश दरिष्ट उत्पादक सुधार सिंह राठौरको कणालीतिक रहेको सुनाउ । पुराना संरचना भौतिकरहेका छन्, जातिमा भएका अनुसधान कानुनमन्त्री सिसिलले लखता संरचनालाई तत्काल मर्मत गरिने वचन दिएु ।',
    pageUrl: 'https://example.com/page1',
    audioUrl: 'https://audio.example.com/audio1.mp3',
    createdDate: '2025-05-28',
    listens: 142
  },
  {
    id: 2,
    voice: { name: 'Rija', code: 'NP' },
    text: 'कणालीमा प्रदेशमा पूर्व कानुन मन्त्री दिपकबहादुर शाही संघ र प्रदेशले साझा प्रदेशमा स्थानीय कार्यालै बनाएका बताउँदै । हाल बाहिरमा रहेर सरकार निर्माणका लागि उमगा अधार लगायतका कारण कणालीमा हुनुपर्ने निर्मित',
    pageUrl: 'https://example.com/page2',
    audioUrl: 'https://audio.example.com/audio2.mp3',
    createdDate: '2025-05-27',
    listens: 89
  },
  {
    id: 3,
    voice: { name: 'Rija', code: 'NP' },
    text: 'यसैगरि कणालीका लागि भनिएका र दटा तालिम प्राप्त कुकुर भने अहिले दटा कुकुर त्यसपछ खानिने संरक्षणलाई व्यवस्थापन गर्ने प्रयास गरिएका फिभाग कणालीसँग भएका छ । जसले गर्दा अनुसार अनुसन्धानमा दिइएर हुने गरे १५ देखि २० दिनमा जाहिने चाहिन्छ । साँझी अनुसारको जगाको संरचना निष्कर्षण प्रदेश कार्यालय पनि नेपालगञ्जबाट सञ्चालित छन् ।',
    pageUrl: 'https://example.com/page3',
    audioUrl: 'https://audio.example.com/audio3.mp3',
    createdDate: '2025-05-26',
    listens: 56
  },
  {
    id: 4,
    voice: { name: 'Rija', code: 'NP' },
    text: 'प्रदेश प्रदेश मातहतमा रहने प्रदेश तालिम केन्द्र, दुर्गा निष्कर्षण प्रदेश का कणालीमा स्थानीय सहकारीदेखि छैन । पूर्वाधारको अभाव देखाउँदै तालिम ।',
    pageUrl: 'https://example.com/page4',
    audioUrl: 'https://audio.example.com/audio4.mp3',
    createdDate: '2025-05-25',
    listens: 23
  }
];

const HistoryTab: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>(mockHistoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{field: keyof HistoryItem | null, direction: 'asc' | 'desc'}>({
    field: 'createdDate',
    direction: 'desc'
  });
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setHistoryData(historyData.filter(item => item.id !== id));
    }
  };
  
  const handleUpload = (id: number, file: File) => {
    console.log(`Uploading file ${file.name} for item ${id}`);
    // Implement upload logic here
  };
  
  const handlePlayAudio = (url: string) => {
    console.log(`Playing audio from ${url}`);
    // Implement audio playback logic here
  };
  
  const sortData = (field: keyof HistoryItem) => {
    const newDirection = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, direction: newDirection });
  };
  
  const getSortedData = () => {
    if (!sortBy.field) return historyData;
    
    return [...historyData].sort((a, b) => {
      if (sortBy.field === 'listens') {
        return sortBy.direction === 'asc' 
          ? a.listens - b.listens 
          : b.listens - a.listens;
      } else if (sortBy.field === 'createdDate') {
        return sortBy.direction === 'asc'
          ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      } else {
        const aValue = a[sortBy.field];
        const bValue = b[sortBy.field];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortBy.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      }
    });
  };
  
  const filteredData = getSortedData().filter(item => 
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
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr 
                    key={item.id} 
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;