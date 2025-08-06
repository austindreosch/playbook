'use client';

import * as Avatar from '@/components/alignui/avatar';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import EmptyIcon from '@/components/icons/EmptyIcon';
import {
  Bandage,
  Goal,
  ShieldHalf,
  TimerReset,
  Users,
  Watch,
} from 'lucide-react';

interface PlayerData {
  positionRank: string;
  position: string;
  name: string;
  mpg?: string;
  team?: string;
  age?: string;
  rosterPercentage?: string;
  playoffScheduleGrade?: string;
  injuryStatus?: string;
  image?: string;
}

interface PlayerInfoSectionProps {
  playerData: PlayerData;
}

function StatItem({
  icon: Icon,
  value,
  valueClassName,
}: {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  value?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="hw-icon-sm text-soft-400 flex-shrink-0" />
      <div
        className={`text-subheading-sm font-medium ${
          valueClassName || 'text-sub-600'
        }`}
      >
        {value || <EmptyIcon className="hw-icon-sm text-soft-400" />}
      </div>
    </div>
  );
}

export default function PlayerInfoSection({
  playerData,
}: PlayerInfoSectionProps) {
  const getInjuryStatusClass = (status?: string) => {
    switch (status) {
      case 'H':
        return 'text-success-base';
      case 'Q':
        return 'text-warning-base';
      case 'O':
        return 'text-error-base';
      default:
        return 'text-success-base';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-10 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-10 before:ring-1 before:ring-inset before:ring-stroke-soft-100">
      <div className="flex gap-5 p-3">
        {/* Player Info */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-title-h6 font-semibold text-strong-950">
              {playerData.name}
            </h4>
            <div className="flex items-center gap-1">
              <Badge.Root variant="rank" color="gray" size="small">
                 {playerData.positionRank}
              </Badge.Root>
              <Badge.Root variant="position" color="purple" size="small" className="text-subheading-sm font-bold">
                {playerData.position}
              </Badge.Root>
            </div>
          </div>

          <Divider.Root variant="line" className="mb-3 mt-1" />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <StatItem icon={Watch} value={playerData.mpg} />
            <StatItem icon={ShieldHalf} value={playerData.team} />
            <StatItem icon={TimerReset} value={playerData.age} />
            <StatItem icon={Users} value={playerData.rosterPercentage} />
            <StatItem icon={Goal} value={playerData.playoffScheduleGrade} />
            <StatItem
              icon={Bandage}
              value={playerData.injuryStatus ?? 'H'}
              valueClassName={getInjuryStatusClass(playerData.injuryStatus)}
            />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
          <Avatar.Root
            placeholderType="user"
            className="w-full h-full"
          >
            <Avatar.Image
              src={playerData.image}
              alt={playerData.name}
              className="w-full h-full object-cover"
            />
          </Avatar.Root>
        </div>
      </div>
    </div>
  );
}