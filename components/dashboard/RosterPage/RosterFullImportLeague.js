'use client';

import { Button } from '@/components/alignui/button';
import { BookUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard block prompting the user to import a league so we can display
 * roster-level insights. Sits inside the left sidebar of the overview screen.
 */
export default function RosterFullImportLeague() {
  return (
    <div className="w-full h-full bg-bg-weak-50 border-1.5 border-stroke-soft-200 rounded-lg shadow-inner flex flex-col items-center justify-center p-4 text-center select-none">
      <BookUp className="w-8 h-8 text-sub-600 mb-3" />
      <p className="text-sm font-medium text-strong-950 mb-4 max-w-[12rem]">
        Import your first league <br /> and build your Playbook.
      </p>
      <Link href="/dashboard" passHref legacyBehavior>
        <Button asChild size="sm" className="px-4">
          <span>Import League</span>
        </Button>
      </Link>
    </div>
  );
}
