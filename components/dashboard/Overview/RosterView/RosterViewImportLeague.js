import { Button } from '@/components/alignui/button';
import { BookUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard block prompting the user to import a league so we can display
 * roster-level insights. Sits inside the left sidebar of the overview screen.
 */
export default function RosterViewImportLeague() {
  return (
    <div className="w-full h-full bg-bg-weak-50 border border-stroke-soft-200 rounded-lg shadow-inner flex flex-col items-center justify-center p-4 text-center select-none">
      <BookUp className="w-7 h-7 text-bg-surface-800 mb-3" />
      <p className="text-xs text-bg-surface-800 mb-4 max-w-[12rem]">
        Import your first league <br /> and build your Playbook.
      </p>
      <Link href="/dashboard" passHref legacyBehavior>
        <Button asChild size="sm" className="px-4 bg-primary-base text-bg-white-0">
          <span className="text-button">Import League</span>
        </Button>
      </Link>
    </div>
  );
}
