import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { mockTrades } from '../dummyDataTradesPage';

export default function TradeResultsBar() {
  const { leagues, currentLeagueId } = useDashboardContext();

  if (!currentLeagueId || !leagues || leagues.length === 0) {
    return null; // or a loading/skeleton state
  }

  const currentLeague = leagues.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );

  if (!currentLeague) {
    return null; // handle case where league isn't found
  }
  
  const selectedSport = currentLeague.leagueDetails.sport.toLowerCase();
  const trade = mockTrades[selectedSport];

  if (!trade) {
    // Handle cases where there's no mock trade for the current sport
    return <div className="p-4 text-center">No trade proposal available for {selectedSport.toUpperCase()}.</div>;
  }

  const playersSent = trade.user;
  const playersReceived = trade.opponent;
  const valueAdjustment = trade.valueAdjustment || 0;

  // Correctly determine which side has fewer players.
  const receivedFewerPlayers = playersReceived.length < playersSent.length;

  const sentRawValue = playersSent.reduce((sum, p) => sum + p.value, 0);
  const receivedRawValue = playersReceived.reduce((sum, p) => sum + p.value, 0);
  
  // Add adjustment to the side with fewer players.
  const receivedAdjustedValue = receivedRawValue + (receivedFewerPlayers ? valueAdjustment : 0);
  const sentAdjustedValue = sentRawValue + (!receivedFewerPlayers ? valueAdjustment : 0);

  const finalValueMargin = receivedAdjustedValue - sentAdjustedValue;
  const isWinningTrade = finalValueMargin > 0;

  // Visuals for main bar are based on win probability from the trade data
  const winningPercentage = trade.winProbability ? trade.winProbability * 100 : 50;
  const losingPercentage = 100 - winningPercentage;
  
  const receivedColor = 'pb_green';
  const sentColor = 'pb_red';

  // New: Calculate total value including the adjustment for segment widths
  const totalVisualValue = sentRawValue + receivedRawValue + valueAdjustment;

  const receivedSegments = playersReceived.map(p => ({
    id: p.id,
    value: p.value,
    colorClass: `bg-${receivedColor}`
  }));

  const sentSegments = playersSent.map(p => ({
    id: p.id,
    value: p.value,
    colorClass: `bg-${sentColor}`
  }));

  if (valueAdjustment > 0) {
    if (receivedFewerPlayers) {
      // Adjustment on the "received" (green) side: add to the beginning (far left).
      receivedSegments.unshift({
        id: 'adjustment',
        value: valueAdjustment,
        colorClass: 'bg-pb_green-900'
      });
    } else {
      // Adjustment on the "sent" (red) side: add to the end (far right).
      sentSegments.push({
        id: 'adjustment',
        value: valueAdjustment,
        colorClass: 'bg-pb_red-900'
      });
    }
  }

  const visualSegments = [...receivedSegments, ...sentSegments];

  return (
    <div className="w-full mx-auto">
      {/* Main bar container */}
      <div className="relative rounded-lg overflow-hidden shadow-sm">
        <div className="flex h-9 relative">
          {/* Players Received (Green) - always on the left */}
          <div 
            style={{ width: `${winningPercentage}%` }} 
            className={`bg-${receivedColor} flex items-center justify-end pr-4 text-white font-medium`}
          >
            {isWinningTrade && (
              <div className="flex items-center gap-2 z-10">
                <ThumbsUp className="h-icon w-icon" />
                <span className="font-bold text-sm">{`${Math.round(winningPercentage)}%`}</span>
              </div>
            )}
          </div>
          {/* Players Sent (Red) - always on the right */}
          <div 
            style={{ width: `${losingPercentage}%` }} 
            className={`bg-${sentColor} flex items-center justify-start pl-4 text-white font-medium`}
          >
            {!isWinningTrade && (
              <div className="flex items-center gap-2 z-10">
                <span className="font-bold text-lg">{`${Math.round(winningPercentage)}%`}</span>
                <ThumbsDown className="h-icon w-icon" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player name labels */}
      <div className="flex w-full mt-1.5 items-center">
        {/* Adjustment Value Label (Left side) */}
        {valueAdjustment > 0 && receivedFewerPlayers && (
          <div
            className={`text-2xs font-semibold text-center leading-none text-pb_greendisabled`}
            style={{ width: `${(valueAdjustment / totalVisualValue) * 100}%` }}
          >
            +
          </div>
        )}
        {/* Received Players (Left) */}
        {playersReceived.map((player) => (
          <div
            key={player.id}
            className={`text-2xs font-semibold text-center truncate px-1 leading-none text-pb_greendisabled/80`}
            style={{ width: `${(player.value / totalVisualValue) * 100}%` }}
          >
            {player.name.split(' ').pop().toUpperCase()}
          </div>
        ))}
        
        {/* Sent Players (Right) */}
        {playersSent.map((player) => (
          <div
            key={player.id}
            className={`text-2xs font-semibold text-center truncate px-1 leading-none text-${sentColor}disabled/80`}
            style={{ width: `${(player.value / totalVisualValue) * 100}%` }}
          >
            {player.name.split(' ').pop().toUpperCase()}
          </div>
        ))}
        {/* Adjustment Value Label (Right side) */}
        {valueAdjustment > 0 && !receivedFewerPlayers && (
          <div
            className={`text-sm leading-none text-center text-pb_reddisabled/80`}
            style={{ width: `${(valueAdjustment / totalVisualValue) * 100}%` }}
          >
            +
          </div>
        )}
      </div>

      {/* Bottom thin line indicator */}
      <div className="flex h-2 relative w-full items-center mb-7">
        {visualSegments.map((segment, index) => (
          <div
            key={segment.id}
            className={`h-full ${segment.colorClass} ${index < visualSegments.length - 1 ? 'border-r border-white' : ''}`}
            style={{ width: `${(segment.value / totalVisualValue) * 100}%` }}
          />
        ))}

        {/* Corrected Divider line */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-5 w-[3px] ${isWinningTrade ? 'bg-pb_green' : 'bg-pb_redhover'}`} 
          style={{ left: `${(receivedAdjustedValue / totalVisualValue) * 100}%`, transform: 'translateY(-50%) translateX(-50%)' }} 
        />

        {/* Margin indicator positioned under the divider */}
        <div 
          className="absolute top-full w-max"
          style={{
            left: `${(receivedAdjustedValue / totalVisualValue) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className={`mt-2 inline-block font-bold text-lg leading-none text-${isWinningTrade ? receivedColor : sentColor}`}>
            {finalValueMargin >= 0 ? '+' : ''}{finalValueMargin.toLocaleString()}
          </span>
        </div>
      </div>
      



    </div>

    
  );
}