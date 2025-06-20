import { BookUp } from 'lucide-react';

export default function DownloadButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-10 justify-center rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none ${className}`.trim()}
    >
      <BookUp className="w-5 h-5 text-pb_darkgray" />
    </button>
  );
} 