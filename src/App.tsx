import React, { useEffect, useState } from 'react';
import { Share2, Save } from 'lucide-react';
import MindMap from './components/MindMap';
import { categorizeUrl, type HistoryNode } from './utils/history';

function App() {
  const [history, setHistory] = useState<HistoryNode[]>([]);
  const [journeyName, setJourneyName] = useState('');
  const [savedJourneys, setSavedJourneys] = useState<string[]>([]);

  useEffect(() => {
    // @ts-ignore - Chrome API
    chrome.history.search({
      text: '',
      maxResults: 10,
      startTime: Date.now() - 24 * 60 * 60 * 1000
    }, (historyItems) => {
      const nodes = historyItems.map(item => ({
        id: item.id!,
        url: item.url!,
        title: item.title || 'Untitled',
        category: categorizeUrl(item.url!),
        visitCount: item.visitCount || 1,
        lastVisit: item.lastVisitTime!
      }));
      setHistory(nodes);
    });

    // Load saved journeys
    chrome.storage.local.get(['journeys'], (result) => {
      if (result.journeys) {
        setSavedJourneys(Object.keys(result.journeys));
      }
    });
  }, []);

  const saveJourney = () => {
    if (!journeyName.trim()) return;
    
    chrome.storage.local.get(['journeys'], (result) => {
      const journeys = result.journeys || {};
      journeys[journeyName] = history;
      
      chrome.storage.local.set({ journeys }, () => {
        setSavedJourneys([...savedJourneys, journeyName]);
        setJourneyName('');
      });
    });
  };

  return (
    <div className="w-[600px] h-[400px] bg-gray-50 p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          History Mind Map
        </h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Journey name"
            value={journeyName}
            onChange={(e) => setJourneyName(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
          />
          <button
            onClick={saveJourney}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </header>

      <div className="relative h-[320px] bg-white rounded-lg shadow-sm border">
        <MindMap nodes={history} />
      </div>

      {savedJourneys.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Saved Journeys</h2>
          <div className="flex gap-2 flex-wrap">
            {savedJourneys.map(journey => (
              <span key={journey} className="px-2 py-1 text-xs bg-gray-100 rounded">
                {journey}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;