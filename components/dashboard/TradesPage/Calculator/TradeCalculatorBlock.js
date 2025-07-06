import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboardContext from "@/stores/dashboard/useDashboardContext";
import { mockTrades } from "../dummyDataTradesPage";
import OpponentPlayerRow from "../TeamBlock/OpponentPlayerRow";
import TradePlayerRow from "../TeamBlock/TradePlayerRow";
import TradeControlsPanel from "./TradeControlsPanel";

const useTradeCalculator = () => {
  const { leagues, currentLeagueId } = useDashboardContext();

  if (!currentLeagueId || !leagues || !leagues.length) {
    return { isLoading: true };
  }

  const currentLeague = leagues.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );

  if (!currentLeague) {
    return { isLoading: true };
  }
  
  const selectedSport = currentLeague.leagueDetails.sport.toLowerCase();
  const trade = mockTrades[selectedSport];

  if (!trade) {
    return { error: `No trade data available for ${selectedSport.toUpperCase()}.` };
  }
  
  const sendPlayers = trade.user;
  const receivePlayers = trade.opponent;
  const valueAdjustment = trade.valueAdjustment || 0;

  const receivedFewerPlayers = receivePlayers.length < sendPlayers.length;

  const sentRawValue = sendPlayers.reduce((sum, p) => sum + p.value, 0);
  const receivedRawValue = receivePlayers.reduce((sum, p) => sum + p.value, 0);
  
  const sendTotal = sentRawValue + (!receivedFewerPlayers ? valueAdjustment : 0);
  const receiveTotal = receivedRawValue + (receivedFewerPlayers ? valueAdjustment : 0);

  const sendAdjustment = !receivedFewerPlayers ? valueAdjustment : 0;
  const receiveAdjustment = receivedFewerPlayers ? valueAdjustment : 0;

  return {
    sendPlayers,
    receivePlayers,
    sendTotal,
    receiveTotal,
    sendAdjustment,
    receiveAdjustment
  };
};

const TradePanel = ({ type, players, total, valueAdjustment }) => {
  const isOpponent = type === "YOU RECEIVE";
  
  // Dark theme styling for opponent (RECEIVE), light for user (SEND)
  const containerClasses = isOpponent
    ? "bg-pb_textgray border-pb_textlightgray"
    : "bg-pb_backgroundgray border-pb_lightgray";
    
  const headerClasses = isOpponent
    ? "bg-pb_darkgray text-white"
    : "bg-white text-pb_darkgray";
    
  const titleClasses = isOpponent
    ? "text-gray-300"
    : "text-gray-500";
    
  const totalClasses = isOpponent
    ? "text-white"
    : "text-gray-800";
    
  const adjustmentClasses = isOpponent
    ? "bg-pb_textgray text-white"
    : "bg-gray-600 text-white";

  return (
    <Card className={`flex-1 rounded-lg border-1.5 shadow-inner flex flex-col min-h-[400px] min-w-0 ${containerClasses}`}>
      <CardHeader className={`flex flex-row items-center justify-between p-2 px-3.5 mb-2 flex-shrink-0 rounded-t-lg ${headerClasses}`}>
        <CardTitle className={`text-xs font-bold uppercase tracking-wider ${titleClasses}`}>{type}</CardTitle>
        <div className={`text-lg font-bold ${totalClasses}`}>{total.toLocaleString()}</div>
      </CardHeader>
      <CardContent className="p-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {players.map((player, index) => (
            isOpponent ? (
              <OpponentPlayerRow key={index} player={player} />
            ) : (
              <TradePlayerRow key={index} player={player} />
            )
          ))}
          {valueAdjustment > 0 && (
            <div className={`flex items-center justify-between p-2 rounded-md ${adjustmentClasses}`}>
              <span className="font-medium">Value Adjustment</span>
              <span className="font-bold">+{valueAdjustment}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function TradeCalculatorBlock() {
  const { 
    isLoading, 
    error, 
    sendPlayers, 
    receivePlayers, 
    sendTotal, 
    receiveTotal, 
    sendAdjustment, 
    receiveAdjustment 
  } = useTradeCalculator();

  if (isLoading) return null; // Or a loading skeleton
  if (error) return <div className="p-4 text-center">{error}</div>;

  return (
  <div className="w-full flex flex-col space-y-4">
    <div className="flex h-9">
      <TradeControlsPanel />
    </div>
    <div className="flex-1 rounded-lg flex justify-center gap-4">
      <TradePanel type="YOU SEND" players={sendPlayers} total={sendTotal} valueAdjustment={sendAdjustment} />
      <TradePanel type="YOU RECEIVE" players={receivePlayers} total={receiveTotal} valueAdjustment={receiveAdjustment} />
    </div>
  </div>
  );
} 