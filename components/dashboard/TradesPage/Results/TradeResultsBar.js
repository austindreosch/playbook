import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { mockTrades, opponentPlayers, userPlayers } from '../dummyDataTradesPage';

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

  const sentFewerPlayers = playersSent.length < playersReceived.length;

  const sentRawValue = playersSent.reduce((sum, p) => sum + p.value, 0);
  const receivedRawValue = playersReceived.reduce((sum, p) => sum + p.value, 0);
  
  const sentAdjustedValue = sentRawValue + (sentFewerPlayers ? valueAdjustment : 0);
  const receivedAdjustedValue = receivedRawValue + (!sentFewerPlayers ? valueAdjustment : 0);

  const finalValueMargin = receivedAdjustedValue - sentAdjustedValue;
  const isWinningTrade = finalValueMargin > 0;

  // Visuals for main bar are based on adjusted values
  const totalAdjustedValue = sentAdjustedValue + receivedAdjustedValue;
  const winningPercentage = totalAdjustedValue > 0 ? (receivedAdjustedValue / totalAdjustedValue) * 100 : 50;
  const losingPercentage = 100 - winningPercentage;

  // Visuals for player segments are based on raw player values
  const totalRawValue = sentRawValue + receivedRawValue;
  const receivedRawPercentage = totalRawValue > 0 ? (receivedRawValue / totalRawValue) * 100 : 50;
  
  const winningColor = isWinningTrade ? 'pb_green' : 'pb_red';
  const losingColor = isWinningTrade ? 'pb_red' : 'pb_green';

  // New: Calculate total value including the adjustment for segment widths
  const totalVisualValue = sentRawValue + receivedRawValue + valueAdjustment;

  const visualSegments = [
    ...playersReceived.map(p => ({
      id: p.id,
      value: p.value,
      colorClass: `bg-${winningColor}`
    })),
    ...playersSent.map(p => ({
      id: p.id,
      value: p.value,
      colorClass: `bg-${losingColor}`
    }))
  ];

  if (valueAdjustment > 0 && sentFewerPlayers) {
    visualSegments.push({
      id: 'adjustment',
      value: valueAdjustment,
      colorClass: 'bg-red-800'
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Main bar container */}
      <div className="relative rounded-lg overflow-hidden shadow-sm">
        <div className="flex h-16 relative">
          {/* Winning Side (Green) - Players Received */}
          <div 
            style={{ width: `${winningPercentage}%` }} 
            className={`bg-${winningColor} flex items-center justify-end pr-4 text-white text-xs font-medium`}
          >
            <span className="font-bold text-lg z-10">{`${Math.round(winningPercentage)}%`}</span>
          </div>
          {/* Losing Side (Red) - Players Sent */}
          <div 
            style={{ width: `${losingPercentage}%` }} 
            className={`bg-${losingColor}`}
          >
          </div>
        </div>
      </div>

      {/* Player name labels */}
      <div className="flex w-full mt-2 items-center">
        {/* Received Players (Left) */}
        {playersReceived.map((player) => (
          <div
            key={player.id}
            className={`text-xs font-semibold text-center truncate px-1 text-${winningColor}`}
            style={{ width: `${(player.value / totalVisualValue) * 100}%` }}
          >
            {player.name.split(' ').pop().toUpperCase()}
          </div>
        ))}
        {/* Sent Players (Right) */}
        {playersSent.map((player) => (
          <div
            key={player.id}
            className={`text-xs font-semibold text-center truncate px-1 text-${losingColor}`}
            style={{ width: `${(player.value / totalVisualValue) * 100}%` }}
          >
            {player.name.split(' ').pop().toUpperCase()}
          </div>
        ))}
        {/* Adjustment Value Label */}
        {valueAdjustment > 0 && sentFewerPlayers && (
          <div 
            className="text-xs font-semibold text-center text-red-700"
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
          className="absolute top-1/2 -translate-y-1/2 h-4 w-0.5 bg-gray-700" 
          style={{ left: `${(receivedRawValue / totalVisualValue) * 100}%` }} 
        />

        {/* Margin indicator positioned under the divider */}
        <div 
          className="absolute top-full w-max"
          style={{
            left: `${(receivedRawValue / totalVisualValue) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className={`mt-1 inline-block font-bold text-xl text-${winningColor}`}>
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