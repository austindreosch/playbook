'use client';

import { CheckCircle, Users, Calendar, Trophy, BarChart2, Swords } from 'lucide-react';
import { SyncBadge } from './SyncIndicator';

interface LeaguePreviewCardProps {
  /** API response with form mapping data */
  apiData: {
    formData: {
      leagueName: string;
      sport: string;
      leagueType?: string;
      scoring: string;
      matchup: string;
      teamCount: number;
      apiData: {
        platform: string;
        fetchedAt: string;
      };
    };
    syncedFields: string[];
    apiSuccess: boolean;
  } | null;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Platform being used */
  platform?: string;
}

/**
 * Preview card showing fetched league data with sync indicators
 * Displays key league info and which fields were auto-populated
 */
export default function LeaguePreviewCard({ apiData, loading, error, platform }: LeaguePreviewCardProps) {
  // Don't render if no data and not loading/error
  if (!apiData && !loading && !error) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 animate-pulse">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <div className="w-24 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-1">
          <div className="w-full h-3 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-2">
        <div className="flex items-center gap-1 text-red-700 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-200"></div>
          <span className="text-paragraph">Failed to fetch league data</span>
        </div>
        <p className="text-paragraph-xs text-red-600">{error}</p>
      </div>
    );
  }

  // Success state with data
  if (!apiData || !apiData.apiSuccess) {
    return null;
  }

  const { formData, syncedFields } = apiData;
  const platformName = platform || formData.apiData.platform;
  const capitalizedPlatform = platformName.charAt(0).toUpperCase() + platformName.slice(1);

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-2">
      {/* Header with success indicator */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <CheckCircle className="hw-icon-xs text-green-600" />
          <span className="text-paragraph text-green-800">
            League Data Synced
          </span>
        </div>
        <SyncBadge synced={true} platform={capitalizedPlatform} />
      </div>

      {/* League info */}
      <div className="space-y-1">
        {/* League name and basic info */}
        <div>
          <h3 className="text-label text-gray-900">
            {formData.leagueName}
          </h3>
          <div className="flex items-center gap-2 text-paragraph text-gray-600">
            <div className="flex items-center gap-1">
              <Trophy className="hw-icon-xs" />
              {formData.sport}
            </div>
            {formData.leagueType && (
              <div className="flex items-center gap-1">
                <Calendar className="hw-icon-xs" />
                {formData.leagueType}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="hw-icon-xs" />
              {formData.teamCount} teams
            </div>
          </div>
        </div>

        {/* Scoring and matchup info */}
        <div className="flex items-center gap-2 text-paragraph text-gray-600">
          <div className="flex items-center gap-1">
            <BarChart2 className="hw-icon-xs" />
            {formData.scoring} scoring
          </div>
          <div className="flex items-center gap-1">
            <Swords className="hw-icon-xs" />
            {formData.matchup} matchups
          </div>
        </div>

        {/* Sync summary */}
        <div className="pt-1 border-t border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-paragraph-xs text-green-700">
              {syncedFields.length} field{syncedFields.length !== 1 ? 's' : ''} auto-populated
            </span>
            <span className="text-paragraph-xs text-gray-500">
              From {capitalizedPlatform}
            </span>
          </div>
        </div>
      </div>

      {/* Override message */}
      <div className="mt-1 pt-1 border-t border-green-200">
        <p className="text-paragraph-xs text-gray-600">
          You can override any of the auto-populated settings below if needed.
        </p>
      </div>
    </div>
  );
}

/**
 * Compact version for use in smaller spaces
 */
export function LeaguePreviewCompact({ apiData, loading, error }: LeaguePreviewCardProps) {
  if (!apiData && !loading && !error) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-1 p-1 rounded border border-gray-200 bg-gray-50 animate-pulse">
        <div className="w-3 h-3 bg-gray-200 rounded"></div>
        <div className="w-24 h-3 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-1 p-1 rounded border border-red-200 bg-red-50">
        <div className="w-3 h-3 rounded-full bg-red-200"></div>
        <span className="text-paragraph-xs text-red-600">Failed to sync</span>
      </div>
    );
  }

  if (!apiData || !apiData.apiSuccess) return null;

  const { formData, syncedFields } = apiData;

  return (
    <div className="flex items-center gap-1 p-1 rounded border border-green-200 bg-green-50">
      <CheckCircle className="hw-icon-xs text-green-600 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-paragraph text-green-800 truncate">
          {formData.leagueName}
        </div>
        <div className="text-paragraph-xs text-green-600">
          {syncedFields.length} fields synced
        </div>
      </div>
    </div>
  );
}