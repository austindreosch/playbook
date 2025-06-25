import { GripVertical, Lock, Package } from 'lucide-react';

export default function TradePlayerRow({ player }) {
  return (
    <div className="flex items-center justify-between bg-white border border-pb_lightergray rounded-md p-2 py-2.5">
      {/* drag handle + name */}
      <div className="flex items-center space-x-2 text-pb_darkgray">
        <GripVertical className="w-5 h-5" />
        <span className="text-sm font-semibold text-pb_darkgray">{player.name}</span>
      </div>

      {/* lock icon + value */}
      <div className="flex items-center space-x-1 text-pb_darkgray">
        <div className="w-5 h-5">
            {player.icon === 'lock' && <Lock className="w-5 h-5" />}
            {player.icon === 'box' && <Package className="w-5 h-5" />}
        </div>
        <span className="w-10  text-sm font-semibold text-pb_darkgray text-center">{player.value}</span>
      </div>
    </div>
  );
}