import { Newspaper } from 'lucide-react';

export default function NewsFeedBlock() {
  return (
    <div className={`w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <Newspaper className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">News Feed</h3>
      </div>
      {/* TODO: Implement NewsFeedBlock content */}
    </div>
  );
} 