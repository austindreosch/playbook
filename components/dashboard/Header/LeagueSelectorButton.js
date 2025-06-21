import { basketball } from "@lucide/lab";
import { BookCopy, ChevronsUpDown, createLucideIcon } from 'lucide-react';
const Basketball = createLucideIcon('basketball', basketball);





export default function LeagueSelectorButton({ className = "" }) {
  return (
    <button
      className={`flex items-center justify-between px-3 rounded-md border border-pb_lightgray bg-pb_lightestgray hover:bg-pb_lightgray hover:border-pb_textgray transition-colors duration-200 shadow-sm select-none ${className}`.trim()}
    >
      <div className="flex items-center gap-3">
        <Basketball className="w-5 h-5 text-pb_darkgray hidden xl:inline" />
        <span className="text-sm font-semibold text-pb_darkgray mr-2 truncate text-left max-w-[4rem] xl:max-w-[10rem] 2xl:w-52">League Name</span>
      </div>
      <div className="flex items-center gap-2">
        <ChevronsUpDown className="w-4 h-4 text-pb_darkgray hidden 2xl:inline" />
        <BookCopy className="w-5 h-5 text-pb_darkgray" />
      </div>
    </button>
  );
} 