'use client';

import * as React from 'react';
import { FileText, MessagesSquare, Newspaper, Play, ScrollText, ScrollTextIcon } from 'lucide-react';
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
// ==================== CONFIGURATION =======================
// ============================================================

const NEWS_TYPE_CONFIG = {
  'latest-news': {
    icon: ScrollText,
    title: 'Latest News',
    iconColor: 'text-blue-500',
    headerTextColor: 'text-gray-450',
    headerBgColor: '',
    strokeWidth: 2,
  },
  'new-debate': {
    icon: MessagesSquare,
    title: 'New Debate',
    iconColor: 'text-yellow-500',
    headerTextColor: 'text-gray-450',
    headerBgColor: '',
    strokeWidth: 2,
  },
  'talking-head': {
    icon: Play,
    title: 'Talking Head',
    iconColor: 'text-red-500',
    headerTextColor: 'text-gray-450',
    headerBgColor: '',
    strokeWidth: 2,
  },
} as const;

const DEFAULT_CONFIG = {
  icon: FileText,
  title: 'News',
  iconColor: 'text-gray-400',
  headerTextColor: 'text-gray-450',
  headerBgColor: '',
  strokeWidth: 2,
};

// ============================================================
// ===================== HELPER FUNCTIONS ====================
// ============================================================

const getNewsConfig = (type: string) => {
  return NEWS_TYPE_CONFIG[type as keyof typeof NEWS_TYPE_CONFIG] || DEFAULT_CONFIG;
};

// ============================================================
// =================== COMPONENT DEFINITION ==================
// ============================================================

export default function NewsItem({ item, className = '' }: NewsItemProps) {
  const config = getNewsConfig(item.type);
  const TypeIcon = config.icon;

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
    <div className={`flex-shrink-0 border border-stroke-soft-100 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`${config.headerBgColor} h-9 rounded-t-lg px-3 flex items-center justify-between border-b border-stroke-soft-100`}>
        <div className="flex items-center gap-2">
          <TypeIcon className={`hw-icon-sm ${config.iconColor}`} strokeWidth={config.strokeWidth} />
          <h4 className={`text-label-lg font-semibold ${config.headerTextColor}`}>
            {config.title}
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
          <div className="flex-1 min-w-0">
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