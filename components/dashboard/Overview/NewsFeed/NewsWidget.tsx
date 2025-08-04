'use client';

import * as React from 'react';
import { FileText, MessageSquare, Newspaper, Play, User } from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Avatar from '@/components/alignui/avatar';
import * as Divider from '@/components/alignui/divider';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface NewsBlueprint {
  newsItems: Array<{                    // SOURCE: useDashboardContext().getCurrentTeam().newsFeed
    id: string;
    type: 'latest-news' | 'new-debate' | 'talking-head';
    timestamp: string;                  // Formatted time (e.g., "2:42 PM", "1d", "2d")
    
    // For latest-news type
    player?: {
      name: string;
      avatar?: string;                  // Image URL or placeholder
    };
    content?: string;                   // News content text
    
    // For new-debate type
    question?: string;                  // Debate question
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
      logo?: string;                    // Source logo/avatar
    };
    quote?: string;                     // Quote content
  }>;
}

interface NewsWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: NewsBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateNewsData = (): NewsBlueprint => {
  const newsItems = [
    {
      id: 'news-1',
      type: 'latest-news' as const,
      timestamp: '2:42 PM',
      player: {
        name: 'L. Doncic',
        avatar: undefined
      },
      content: 'Doncic accumulated 28 points (7-18 FG, 2-8 3Pt, 12-15 FT), seven rebounds, nine assists and one steal across 40 minutes during....'
    },
    {
      id: 'debate-1',
      type: 'new-debate' as const,
      timestamp: '1d',
      question: 'What can we expect from Luka next season?',
      author: {
        name: 'FantasyExpert',
        avatar: undefined
      },
      response: {
        author: 'HotTakes123',
        content: '"Bros washed without Kyrie, I would trade him now and wouldn\'t think twice about it."'
      }
    },
    {
      id: 'talking-head-1',
      type: 'talking-head' as const,
      timestamp: '2d',
      source: {
        name: 'Dynasty Domain',
        logo: undefined
      },
      quote: '"Luka\'s counting stats are elite - but that FG% and TO are anchor weights. Be careful in 9-cat."'
    },
    {
      id: 'news-2',
      type: 'latest-news' as const,
      timestamp: '3:15 PM',
      player: {
        name: 'J. Tatum',
        avatar: undefined
      },
      content: 'Tatum recorded 31 points (11-22 FG, 5-12 3Pt, 4-4 FT), eight rebounds, four assists, and two steals in 36 minutes during Monday\'s win over the Bulls.'
    }
  ];

  return { newsItems };
};

// Helper Functions
const getNewsTypeIcon = (type: string) => {
  switch (type) {
    case 'latest-news':
      return FileText;
    case 'new-debate':
      return MessageSquare;
    case 'talking-head':
      return Play;
    default:
      return FileText;
  }
};

const getNewsTypeColor = (type: string) => {
  switch (type) {
    case 'latest-news':
      return 'bg-bg-weak-50';
    case 'new-debate':
      return 'bg-warning-lighter';
    case 'talking-head':
      return 'bg-bg-strong-950';
    default:
      return 'bg-bg-weak-50';
  }
};

const getNewsHeaderTextColor = (type: string) => {
  switch (type) {
    case 'latest-news':
      return 'text-text-soft-400';
    case 'new-debate':
      return 'text-text-strong-950';
    case 'talking-head':
      return 'text-static-white';
    default:
      return 'text-text-soft-400';
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

export default function NewsWidget({
  blueprint: providedBlueprint,
  ...rest
}: NewsWidgetProps) {
  const { getCurrentTeam } = useDashboardContext();
  
  // Use provided blueprint or generate dummy data
  const blueprint = providedBlueprint || generateNewsData();

  return (
    <WidgetBox.Root className="h-full" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Newspaper} />
        News Feed
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
          {blueprint.newsItems.map((item) => {
            const TypeIcon = getNewsTypeIcon(item.type);
            const headerColor = getNewsTypeColor(item.type);
            const textColor = getNewsHeaderTextColor(item.type);
            const title = getNewsTypeTitle(item.type);

            return (
              <div key={item.id} className="flex-shrink-0">
                {/* Header */}
                <div className={`${headerColor} rounded-t-lg px-3 py-1.5 flex items-center justify-between`}>
                  <h4 className={`text-label-sm font-medium ${textColor}`}>
                    {title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <TypeIcon className={`hw-icon-xs ${textColor}`} strokeWidth={2} />
                    {item.type === 'new-debate' && (
                      <FileText className={`hw-icon-xs ${textColor}`} strokeWidth={2} />
                    )}
                    {item.type === 'talking-head' && (
                      <FileText className={`hw-icon-xs ${textColor}`} strokeWidth={2} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-bg-weak-25 rounded-b-lg p-3">
                  {/* Latest News */}
                  {item.type === 'latest-news' && item.player && (
                    <div className="flex items-start gap-2">
                      <Avatar.Root size="small" className="flex-shrink-0">
                        <Avatar.Fallback className="text-label-xs">
                          {item.player.name.charAt(0)}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-label-sm font-medium text-text-soft-400 truncate">
                            {item.player.name}
                          </span>
                          <span className="text-paragraph-xs text-text-disabled-300 flex-shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-paragraph-xs text-text-soft-400 leading-relaxed line-clamp-3">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* New Debate */}
                  {item.type === 'new-debate' && (
                    <>
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar.Root size="small" className="flex-shrink-0">
                          <Avatar.Fallback className="text-label-xs">
                            {item.author?.name.charAt(0) || 'A'}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-label-sm text-text-soft-400 line-clamp-2">
                              {item.question}
                            </p>
                            <span className="text-paragraph-xs text-text-disabled-300 flex-shrink-0 ml-2">
                              {item.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                      {item.response && (
                        <div className="pl-10">
                          <p className="text-label-sm font-medium text-text-strong-950 mb-1">
                            {item.response.author}:
                          </p>
                          <p className="text-paragraph-xs text-text-soft-400 italic line-clamp-2">
                            {item.response.content}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Talking Head */}
                  {item.type === 'talking-head' && item.source && (
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-primary-base rounded-full flex items-center justify-center text-label-xs text-static-white flex-shrink-0">
                        {item.source.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-label-sm font-medium text-text-strong-950 truncate">
                            {item.source.name}
                          </span>
                          <span className="text-paragraph-xs text-text-disabled-300 flex-shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-paragraph-xs text-text-soft-400 leading-relaxed line-clamp-3">
                          {item.quote}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}