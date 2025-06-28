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
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Main bar container */}
      <div className="relative rounded-lg overflow-hidden shadow-sm">
        <div className="flex h-12 relative">
          {/* Players Received (Green) - always on the left */}
          <div 
            style={{ width: `${winningPercentage}%` }} 
            className={`bg-${receivedColor} flex items-center justify-end pr-4 text-white font-medium`}
          >
            {isWinningTrade && (
              <div className="flex items-center gap-2 z-10">
                <ThumbsUp className="h-5 w-5" />
                <span className="font-bold text-lg">{`${Math.round(winningPercentage)}%`}</span>
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
                <ThumbsDown className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player name labels */}
      <div className="flex w-full mt-2 items-center">
        {/* Adjustment Value Label (Left side) */}
        {valueAdjustment > 0 && receivedFewerPlayers && (
          <div
            className={`text-sm font-semibold text-center text-pb_greendisabled`}
            style={{ width: `${(valueAdjustment / totalVisualValue) * 100}%` }}
          >
            +
          </div>
        )}
        {/* Received Players (Left) */}
        {playersReceived.map((player) => (
          <div
            key={player.id}
            className={`text-xs font-semibold text-center truncate px-1 text-${receivedColor}disabled`}
            style={{ width: `${(player.value / totalVisualValue) * 100}%` }}
          >
            {player.name.split(' ').pop().toUpperCase()}
          </div>
        ))}
        
        {/* Sent Players (Right) */}
        {playersSent.map((player) => (
          <div
            key={player.id}
            className={`text-xs font-semibold text-center truncate px-1 text-${sentColor}disabled`}
            style={{ width: `${(player.value / totalVisualValue) * 100}%` }}
          >
            {player.name.split(' ').pop().toUpperCase()}
          </div>
        ))}
        {/* Adjustment Value Label (Right side) */}
        {valueAdjustment > 0 && !receivedFewerPlayers && (
          <div
            className={`text-xs font-semibold text-center text-pb_reddisabled`}
            style={{ width: `${(valueAdjustment / totalVisualValue) * 100}%` }}
          >
            +
          </div>
        )}
      </div>

      {/* Bottom thin line indicator */}
      <div className="flex h-2 relative w-full items-center mb-8">
        {visualSegments.map((segment, index) => (
          <div
            key={segment.id}
            className={`h-full ${segment.colorClass} ${index < visualSegments.length - 1 ? 'border-r border-white' : ''}`}
            style={{ width: `${(segment.value / totalVisualValue) * 100}%` }}
          />
        ))}

        {/* Corrected Divider line */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-5 w-1 ${isWinningTrade ? 'bg-pb_greenhover' : 'bg-pb_redhover'}`} 
          style={{ left: `${(receivedAdjustedValue / totalVisualValue) * 100}%` }} 
        />

        {/* Margin indicator positioned under the divider */}
        <div 
          className="absolute top-full w-max"
          style={{
            left: `${(receivedAdjustedValue / totalVisualValue) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className={`mt-2 inline-block font-bold text-xl text-${isWinningTrade ? receivedColor : sentColor}`}>
            {finalValueMargin >= 0 ? '+' : ''}{finalValueMargin.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Mock trade display */}
      <div className="mt-6 flex flex-col md:flex-row md:justify-center gap-8">
        <div className="flex-1">
          <h3 className="text-center font-semibold mb-2">User Sends</h3>
          <ul className="bg-gray-50 rounded p-3 shadow-sm">
            {playersSent.map(player => (
              <li key={player.id} className="py-1 text-center">{player.name} <span className="text-xs text-gray-500">({player.position})</span></li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="text-center font-semibold mb-2">Opponent Sends</h3>
          <ul className="bg-gray-50 rounded p-3 shadow-sm">
            {playersReceived.map(player => (
              <li key={player.id} className="py-1 text-center">{player.name} <span className="text-xs text-gray-500">({player.position})</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600 italic max-w-2xl mx-auto">{trade.rationale}</div>
    </div>
  );
}