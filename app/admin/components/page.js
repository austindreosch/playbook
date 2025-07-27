'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import working empty state illustrations
import IllustrationBudgetOverview from '@/components/alignui/empty-state-illustrations/budget-overview';
import IllustrationCourses from '@/components/alignui/empty-state-illustrations/courses';
import IllustrationCurrentProject from '@/components/alignui/empty-state-illustrations/current-project';
import IllustrationDailyFeedback from '@/components/alignui/empty-state-illustrations/daily-feedback';
import IllustrationEmployeeSpotlight from '@/components/alignui/empty-state-illustrations/employee-spotlight';
import IllustrationExchange from '@/components/alignui/empty-state-illustrations/exchange';
import IllustrationMyCards from '@/components/alignui/empty-state-illustrations/my-cards';
import IllustrationMySubscriptions from '@/components/alignui/empty-state-illustrations/my-subscriptions';
import IllustrationNotes from '@/components/alignui/empty-state-illustrations/notes';
import IllustrationQuickTransfer from '@/components/alignui/empty-state-illustrations/quick-transfer';
import IllustrationRecentTransactions from '@/components/alignui/empty-state-illustrations/recent-transactions';
import IllustrationSavedActions from '@/components/alignui/empty-state-illustrations/saved-actions';
import IllustrationScheduleEvents from '@/components/alignui/empty-state-illustrations/schedule-events';
import IllustrationScheduleHoliday from '@/components/alignui/empty-state-illustrations/schedule-holiday';
import IllustrationScheduleMeetings from '@/components/alignui/empty-state-illustrations/schedule-meetings';
import IllustrationSpendingSummary from '@/components/alignui/empty-state-illustrations/spending-summary';
import IllustrationStatusTracker from '@/components/alignui/empty-state-illustrations/status-tracker';
import IllustrationTimeOff from '@/components/alignui/empty-state-illustrations/time-off';
import IllustrationTimeTracker from '@/components/alignui/empty-state-illustrations/time-tracker';
import IllustrationWorkHourAnalysis from '@/components/alignui/empty-state-illustrations/work-hour-analysis';

// Import simple working components
import { Root as Alert } from '@/components/alignui/alert';
import { Root as Badge } from '@/components/alignui/badge';
import { Button } from '@/components/alignui/button';
import { Root as Divider } from '@/components/alignui/divider';
import { Root as Tag } from '@/components/alignui/tag';
import { Root as StatusBadge } from '@/components/alignui/status-badge';
import { Avatar } from '@/components/alignui/avatar';

// Error boundary component
class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Widget error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-48 bg-bg-weak-50 rounded-lg border border-stroke-soft-200 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-red-300 rounded mx-auto opacity-60"></div>
            <div className="text-subheading-sm text-text-soft-400">Missing Dependencies</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a sample widget component that works without external dependencies
const SampleWidget = ({ title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    orange: 'bg-orange-200',
    purple: 'bg-purple-200',
    red: 'bg-red-200'
  };
  
  return (
    <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-label-md text-text-strong-950 font-medium">{title}</h3>
          <p className="text-paragraph-sm text-text-sub-600">{description}</p>
        </div>
        <Badge variant="filled" color={color}>{color}</Badge>
      </div>
      
      <div className="h-24 bg-bg-weak-50 rounded border border-stroke-soft-200 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 ${colorClasses[color] || 'bg-blue-200'} rounded opacity-60`}></div>
          <div className="text-center">
            <div className="text-title-h5 text-text-strong-950">$12,847</div>
            <div className="text-paragraph-sm text-text-sub-600">Sample Data</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-stroke-soft-200">
        <div className="flex items-center space-x-2">
          <Badge variant="light" color="green">+5.2%</Badge>
          <span className="text-paragraph-sm text-text-sub-600">vs last month</span>
        </div>
        <Button size="small" mode="ghost">View Details</Button>
      </div>
    </div>
  );
};

// Widget Showcase Section
const WidgetShowcase = () => {
  const sampleWidgets = [
    { title: 'Budget Overview', description: 'Track income vs expenses', color: 'blue' },
    { title: 'Campaign Data', description: 'Marketing campaign metrics', color: 'blue' },
    { title: 'Conversion Rate', description: 'User conversion analytics', color: 'green' },
    { title: 'Credit Score', description: 'Financial health tracker', color: 'orange' },
    { title: 'Total Balance', description: 'Current account balance', color: 'purple' },
    { title: 'Total Expenses', description: 'Monthly spending overview', color: 'red' }
  ];

  const allWidgets = [
    'widget-budget-overview', 'widget-campaign-data', 'widget-conversion-rate',
    'widget-course-progress', 'widget-courses', 'widget-credit-score',
    'widget-current-project', 'widget-daily-feedback', 'widget-daily-work-hours',
    'widget-employee-rating', 'widget-employee-spotlight', 'widget-exchange',
    'widget-geography-map', 'widget-major-expenses', 'widget-my-cards',
    'widget-my-cards-compact', 'widget-my-products', 'widget-my-subscriptions',
    'widget-notes', 'widget-product-performance', 'widget-quick-transfer',
    'widget-real-time', 'widget-recent-transactions', 'widget-sales-channels',
    'widget-saved-actions', 'widget-schedule', 'widget-shipping-tracking',
    'widget-spending-summary', 'widget-status-tracker', 'widget-support-analytics',
    'widget-time-off', 'widget-time-tracker', 'widget-total-balance',
    'widget-total-expenses', 'widget-total-sales', 'widget-total-visitors',
    'widget-training-analysis', 'widget-transactions-table', 'widget-user-retention',
    'widget-visitor-channels', 'widget-weekly-visitors', 'widget-work-hour-analysis',
    'customer-segments', 'marketing-channels', 'product-categories', 'recent-activities'
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-title-h2 text-text-strong-950">Widget Templates</h2>
        <p className="text-paragraph-lg text-text-sub-600">
          Pre-built widget components for dashboards and analytics ({allWidgets.length} total)
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-paragraph-sm text-yellow-800">
            ⚠️ Many widget components require additional dependencies (@tanstack/react-table, date-fns, d3-curve-circlecorners, etc.) 
            The examples below show the widget structure with sample data.
          </p>
        </div>
      </div>

      {/* Working Sample Widgets */}
      <div className="space-y-6">
        <h3 className="text-title-h3 text-text-strong-950">Sample Widget Previews</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleWidgets.map((widget, index) => (
            <SampleWidget
              key={index}
              title={widget.title}
              description={widget.description}
              color={widget.color}
            />
          ))}
        </div>
      </div>

      {/* All Available Widgets List */}
      <div className="space-y-6">
        <h3 className="text-title-h3 text-text-strong-950">Complete Widget Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allWidgets.map((widget) => (
            <div key={widget} className="bg-bg-white-0 border border-stroke-soft-200 rounded-lg p-4 space-y-3">
              <div className="h-20 bg-bg-weak-50 rounded border border-stroke-soft-200 flex items-center justify-center">
                <div className="text-center space-y-1">
                  <div className="w-6 h-6 bg-primary-base rounded mx-auto opacity-20"></div>
                  <div className="text-subheading-2xs text-text-soft-400">Widget</div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-label-sm text-text-strong-950 font-medium">
                  {widget.replace('widget-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <p className="text-paragraph-xs text-text-sub-600 font-mono">{widget}.tsx</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Empty State Illustrations Section
const EmptyStateShowcase = () => {
  const illustrations = [
    { name: 'Budget Overview', component: <IllustrationBudgetOverview className="w-20 h-20 mx-auto" />, file: 'budget-overview.tsx' },
    { name: 'Courses', component: <IllustrationCourses className="w-20 h-20 mx-auto" />, file: 'courses.tsx' },
    { name: 'Current Project', component: <IllustrationCurrentProject className="w-20 h-20 mx-auto" />, file: 'current-project.tsx' },
    { name: 'Daily Feedback', component: <IllustrationDailyFeedback className="w-20 h-20 mx-auto" />, file: 'daily-feedback.tsx' },
    { name: 'Employee Spotlight', component: <IllustrationEmployeeSpotlight className="w-20 h-20 mx-auto" />, file: 'employee-spotlight.tsx' },
    { name: 'Exchange', component: <IllustrationExchange className="w-20 h-20 mx-auto" />, file: 'exchange.tsx' },
    { name: 'My Cards', component: <IllustrationMyCards className="w-20 h-20 mx-auto" />, file: 'my-cards.tsx' },
    { name: 'My Subscriptions', component: <IllustrationMySubscriptions className="w-20 h-20 mx-auto" />, file: 'my-subscriptions.tsx' },
    { name: 'Notes', component: <IllustrationNotes className="w-20 h-20 mx-auto" />, file: 'notes.tsx' },
    { name: 'Quick Transfer', component: <IllustrationQuickTransfer className="w-20 h-20 mx-auto" />, file: 'quick-transfer.tsx' },
    { name: 'Recent Transactions', component: <IllustrationRecentTransactions className="w-20 h-20 mx-auto" />, file: 'recent-transactions.tsx' },
    { name: 'Saved Actions', component: <IllustrationSavedActions className="w-20 h-20 mx-auto" />, file: 'saved-actions.tsx' },
    { name: 'Schedule Events', component: <IllustrationScheduleEvents className="w-20 h-20 mx-auto" />, file: 'schedule-events.tsx' },
    { name: 'Schedule Holiday', component: <IllustrationScheduleHoliday className="w-20 h-20 mx-auto" />, file: 'schedule-holiday.tsx' },
    { name: 'Schedule Meetings', component: <IllustrationScheduleMeetings className="w-20 h-20 mx-auto" />, file: 'schedule-meetings.tsx' },
    { name: 'Spending Summary', component: <IllustrationSpendingSummary className="w-20 h-20 mx-auto" />, file: 'spending-summary.tsx' },
    { name: 'Status Tracker', component: <IllustrationStatusTracker className="w-20 h-20 mx-auto" />, file: 'status-tracker.tsx' },
    { name: 'Time Off', component: <IllustrationTimeOff className="w-20 h-20 mx-auto" />, file: 'time-off.tsx' },
    { name: 'Time Tracker', component: <IllustrationTimeTracker className="w-20 h-20 mx-auto" />, file: 'time-tracker.tsx' },
    { name: 'Work Hour Analysis', component: <IllustrationWorkHourAnalysis className="w-20 h-20 mx-auto" />, file: 'work-hour-analysis.tsx' }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-title-h2 text-text-strong-950">Empty State Illustrations</h2>
        <p className="text-paragraph-lg text-text-sub-600">
          SVG illustrations for empty states and placeholders ({illustrations.length} total)
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {illustrations.map((illustration) => (
          <div key={illustration.file} className="bg-bg-white-0 border border-stroke-soft-200 rounded-lg p-4 space-y-3">
            <div className="h-24 bg-bg-weak-50 rounded-lg border border-stroke-soft-200 flex items-center justify-center">
              {illustration.component}
            </div>
            <div className="space-y-1">
              <h3 className="text-label-sm text-text-strong-950 font-medium">
                {illustration.name}
              </h3>
              <p className="text-paragraph-xs text-text-sub-600 font-mono">{illustration.file}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Block Components Section
const BlockComponentsShowcase = () => {
  const blockComponents = [
    { name: 'Alert', component: <Alert>This is an alert message</Alert>, file: 'alert.tsx', type: 'display' },
    { name: 'Badge', component: <Badge variant="filled" color="blue">New</Badge>, file: 'badge.tsx', type: 'ui' },
    { name: 'Button', component: <Button>Click me</Button>, file: 'button.tsx', type: 'ui' },
    { name: 'Divider', component: <Divider />, file: 'divider.tsx', type: 'layout' },
    { name: 'Status Badge', component: <StatusBadge status="completed">Active</StatusBadge>, file: 'status-badge.tsx', type: 'display' },
    { name: 'Tag', component: <Tag>Design</Tag>, file: 'tag.tsx', type: 'display' },
    { name: 'Avatar', component: <Avatar size="40" color="blue" />, file: 'avatar.tsx', type: 'ui' }
  ];

  const groupedComponents = blockComponents.reduce((acc, component) => {
    if (!acc[component.type]) {
      acc[component.type] = [];
    }
    acc[component.type].push(component);
    return acc;
  }, {});

  const typeColors = {
    ui: 'bg-green-50 border-green-200',
    layout: 'bg-purple-50 border-purple-200',
    display: 'bg-pink-50 border-pink-200'
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-title-h2 text-text-strong-950">Block Components</h2>
        <p className="text-paragraph-lg text-text-sub-600">
          Individual UI components (90+ total - showing working examples)
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-paragraph-sm text-blue-800">
            ℹ️ Many components require additional dependencies. The examples below show components that work without external packages.
          </p>
        </div>
      </div>
      
      {Object.entries(groupedComponents).map(([type, components]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-title-h4 text-text-sub-600 capitalize border-b border-stroke-soft-200 pb-2">
            {type} Components (showing {components.length} working examples)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {components.map((component) => (
              <div 
                key={component.file} 
                className={`${typeColors[type]} border rounded-lg p-4 space-y-3`}
              >
                <div className="h-16 bg-white rounded border border-stroke-soft-200 flex items-center justify-center overflow-hidden">
                  <div className="flex items-center justify-center scale-75">
                    {component.component}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-label-sm text-text-strong-950 font-medium">
                    {component.name}
                  </h4>
                  <p className="text-paragraph-xs text-text-sub-600 font-mono">{component.file}</p>
                  <span className="inline-block px-2 py-1 text-subheading-2xs bg-white rounded border border-stroke-soft-200 capitalize">
                    {component.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-title-h5 text-text-strong-950 mb-3">Complete Component Library</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-paragraph-sm text-text-sub-600">
          <div className="space-y-1">
            <div className="font-medium text-text-strong-950">UI Components</div>
            <div>Avatar, Avatar Group, Badge, Button, Button Group, Compact Button, Fancy Button, Link Button, Social Button</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-text-strong-950">Form Components</div>
            <div>Input, Textarea, Select, Checkbox, Radio, Switch, Digit Input, Phone Input, Currency Select, Language Select</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-text-strong-950">Layout Components</div>
            <div>Card Chip, Widget Box, Divider, Table, Modal, Drawer, Popover, Tooltip, Header, Sidebar</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-text-strong-950">Navigation</div>
            <div>Tab Menus, Segmented Control, Pagination, Steppers, Search, Command Menu</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-text-strong-950">Charts & Data</div>
            <div>Spark Charts, Gauge, Category Bar, Step Line, Score Track, Pie Chart, Bar Chart</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-text-strong-950">Progress & Status</div>
            <div>Progress Bar, Progress Circle, Level Bar, Status Badge, Rating Bar</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-white-0 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-title-h1 text-text-strong-950">Component Library</h1>
          <p className="text-paragraph-lg text-text-sub-600">
            Complete showcase of widgets, illustrations, and UI components from AlignUI
          </p>
        </div>

        <Tabs defaultValue="widgets" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">Widget Templates</TabsTrigger>
            <TabsTrigger value="illustrations">Empty States</TabsTrigger>
            <TabsTrigger value="components">Block Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="widgets" className="space-y-0">
            <WidgetShowcase />
          </TabsContent>
          
          <TabsContent value="illustrations" className="space-y-0">
            <EmptyStateShowcase />
          </TabsContent>
          
          <TabsContent value="components" className="space-y-0">
            <BlockComponentsShowcase />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}