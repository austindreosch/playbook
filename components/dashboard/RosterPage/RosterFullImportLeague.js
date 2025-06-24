'use client';

import { Button } from '@/components/ui/button';
import { BookUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard block prompting the user to import a league so we can display
 * roster-level insights. Sits inside the left sidebar of the overview screen.
 */
export default function RosterFullImportLeague() {
  return (
    <div className="w-full h-full bg-pb_backgroundgray border-1.5 border-pb_lightgray rounded-lg shadow-inner flex flex-col items-center justify-center p-4 text-center select-none">
      <BookUp className="w-8 h-8 text-pb_darkgray mb-3" />
      <p className="text-sm font-medium text-pb_darkgray mb-4 max-w-[12rem]">
        Import your first league <br /> and build your Playbook.
      </p>
      <Link href="/dashboard" passHref legacyBehavior>
        <Button asChild size="sm" className="px-4 bg-pb_blue text-pb_paperwhite">
          <span>Import League</span>
        </Button>
      </Link>
    </div>
  );
}
