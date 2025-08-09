'use client';

import * as React from 'react';
import { Newspaper } from 'lucide-react';
import * as WidgetBox from '@/components/alignui/widget-box';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import NewsItem, { type NewsItemData } from './NewsItem';

// ============================================================
// ===================== BLUEPRINT DEFINITION ================
// ============================================================

interface NewsBlueprint {
  newsItems: NewsItemData[];           // SOURCE: useDashboardContext().getCurrentTeam().newsFeed
}

interface NewsWidgetProps extends React.ComponentPropsWithoutRef<typeof WidgetBox.Root> {
  blueprint?: NewsBlueprint;
}

// ============================================================
// ===================== DATA COLLECTION ======================
// ============================================================

const generateNewsData = (): NewsBlueprint => {
  const newsItems: NewsItemData[] = [
    {
      id: 'news-1',
      type: 'latest-news',
      timestamp: '2:42 PM',
      player: {
        name: 'L. Doncic',
        avatar: undefined
      },
      content: 'Doncic accumulated 28 points (7-18 FG, 2-8 3Pt, 12-15 FT), seven rebounds, nine assists and one steal across 40 minutes during....'
    },
    {
      id: 'debate-1',
      type: 'new-debate',
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
      type: 'talking-head',
      timestamp: '2d',
      source: {
        name: 'Dynasty Domain',
        logo: undefined
      },
      quote: '"Luka\'s counting stats are elite - but that FG% and TO are anchor weights. Be careful in 9-cat."'
    },
    {
      id: 'news-2',
      type: 'latest-news',
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
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Newspaper} />
        News Feed
      </WidgetBox.Header>

      <WidgetBox.Content>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
          {blueprint.newsItems.map((item) => (
            <NewsItem key={item.id} item={item} />
          ))}
        </div>
      </WidgetBox.Content>
    </WidgetBox.Root>
  );
}
