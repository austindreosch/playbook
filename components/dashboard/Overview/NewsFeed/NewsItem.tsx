'use client';

import * as React from 'react';
import { FileText, MessagesSquare, Newspaper, Play, Rss, ScrollText, ScrollTextIcon } from 'lucide-react';
import { Root as AvatarRoot, AvatarFallback } from '@/components/alignui/avatar';

// ============================================================
// ===================== TYPE DEFINITIONS ====================
// ============================================================

export interface NewsItemData {
  id: string;
  type: 'latest-news' | 'new-debate' | 'talking-head';
  timestamp: string;
  
  // For latest-news type
  player?: {
    name: string;
    avatar?: string;
  };
  content?: string;
  
  // For new-debate type
  question?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  response?: {
    author: string;
    content: string;
  };
  
  // For talking-head type
  source?: {
    name: string;
    logo?: string;
  };
  quote?: string;
}

interface NewsItemProps {
  item: NewsItemData;
  className?: string;
}

// ============================================================
// ===================== HELPER FUNCTIONS ====================
// ============================================================

const getNewsTypeIcon = (type: string) => {
  switch (type) {
    case 'latest-news':
      return Rss;
    case 'new-debate':
      return MessagesSquare;
    case 'talking-head':
      return Play;
    default:
      return FileText;
  }
};

const getNewsTypeColor = (type: string) => {
  switch (type) {
    // case 'latest-news':
    //   return 'bg-gray-50';
    // case 'new-debate':
    //   return 'bg-warning-lighter';
    // case 'talking-head':
    //   return 'bg-bg-strong-950';
    default:
      return '';
  }
};

const getNewsIconColor = (type: string) => {
  switch (type) {
    case 'latest-news':
      return 'text-blue-500';
    case 'new-debate':
      return 'text-yellow-600';
    case 'talking-head':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};

const getNewsHeaderTextColor = (type: string) => {
  switch (type) {
    case 'latest-news':
      return 'text-gray-450';
    case 'new-debate':
      return 'text-gray-450';
    case 'talking-head':
      return 'text-gray-450';
    default:
      return 'text-gray-450';
  }
};

const getNewsTypeTitle = (type: string) => {
  switch (type) {
    case 'latest-news':
      return 'Latest News';
    case 'new-debate':
      return 'New Debate';
    case 'talking-head':
      return 'Talking Head';
    default:
      return 'News';
  }
};

// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

export default function NewsItem({ item, className = '' }: NewsItemProps) {
  const TypeIcon = getNewsTypeIcon(item.type);
  const headerColor = getNewsTypeColor(item.type);
  const textColor = getNewsHeaderTextColor(item.type);
  const iconColor = getNewsIconColor(item.type);
  const title = getNewsTypeTitle(item.type);

  // Unified data extraction - normalize all news types to common structure
  const getUnifiedData = () => {
    switch (item.type) {
      case 'latest-news':
        return {
          primaryName: item.player?.name || '',
          primaryContent: item.content || '',
          secondaryContent: null,
          avatarLetter: item.player?.name.charAt(0) || 'P'
        };
      case 'new-debate':
        return {
          primaryName: item.author?.name || 'Anonymous',
          primaryContent: item.question || '',
          secondaryContent: item.response ? `${item.response.author}: ${item.response.content}` : null,
          avatarLetter: item.author?.name.charAt(0) || 'A'
        };
      case 'talking-head':
        return {
          primaryName: item.source?.name || '',
          primaryContent: item.quote || '',
          secondaryContent: null,
          avatarLetter: item.source?.name.charAt(0) || 'T'
        };
      default:
        return {
          primaryName: '',
          primaryContent: '',
          secondaryContent: null,
          avatarLetter: 'N'
        };
    }
  };

  const unifiedData = getUnifiedData();

  return (
    <div className={`flex-shrink-0 border border-stroke-soft-100 rounded-lg ${className}`}>
      {/* Header */}
      <div className={`${headerColor} h-9 rounded-t-lg px-3 flex items-center justify-between border-b border-stroke-soft-100`}>
        <div className="flex items-center gap-2">
          <TypeIcon className={`hw-icon-sm ${iconColor}`} strokeWidth={3} />
          <h4 className={`text-label-lg font-semibold ${textColor}`}>
            {title}
          </h4>
        </div>
        <span className="text-paragraph-md text-disabled-300 flex-shrink-0">
          {item.timestamp}
        </span>
      </div>

      {/* Unified Content Structure */}
      <div className="rounded-b-lg p-3">
        <div className="flex items-start gap-3">
          {/* Avatar - Unified for all types */}
          <AvatarRoot size="32" className="flex-shrink-0">
            <AvatarFallback className="text-label-md">
              {unifiedData.avatarLetter}
            </AvatarFallback>
          </AvatarRoot>
          
          {/* Content */}
          <div className="flex-1 min-w-0 mb-0.5">
            {/* Primary Name */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-label-lg font-medium text-strong-950 truncate">
                {unifiedData.primaryName}
              </span>
            </div>
            
            {/* Primary Content */}
            <p className="text-paragraph-md text-soft-400 leading-relaxed line-clamp-3">
              {unifiedData.primaryContent}
            </p>
            
            {/* Secondary Content (for debates) */}
            {unifiedData.secondaryContent && (
              <div className="pl-2 border-l-2 border-stroke-soft-100">
                <p className="text-paragraph-md text-soft-400 italic line-clamp-2">
                  {unifiedData.secondaryContent}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}