export interface HistoryNode {
  id: string;
  url: string;
  title: string;
  category: 'social' | 'work' | 'news' | 'dev' | 'shopping' | 'other';
  visitCount: number;
  lastVisit: number;
}

export function categorizeUrl(url: string): HistoryNode['category'] {
  const domain = new URL(url).hostname.toLowerCase();

  if (domain.match(/facebook|twitter|linkedin|instagram|reddit/)) {
    return 'social';
  }

  if (domain.match(/github|stackoverflow|gitlab|npmjs|dev\./)) {
    return 'dev';
  }

  if (domain.match(/docs|confluence|notion|atlassian|trello|asana/)) {
    return 'work';
  }

  if (domain.match(/news|medium|bbc|cnn|nytimes|reuters/)) {
    return 'news';
  }

  if (domain.match(/amazon|ebay|etsy|shopify|walmart/)) {
    return 'shopping';
  }

  return 'other';
}