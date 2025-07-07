import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import useDashboardContext from "@/stores/dashboard/useDashboardContext";
import { ChevronDown, DollarSign, Scale } from 'lucide-react';
import { useState } from 'react';
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
  const [isAdjustmentExpanded, setIsAdjustmentExpanded] = useState(false);
  
  // Dark theme styling for opponent (RECEIVE), light for user (SEND)
  const containerClasses = isOpponent
    ? "bg-pb_textlighterestgray border-pb_textlightergray"
    : "bg-pb_backgroundgray border-pb_lightgray";
    
  const headerClasses = isOpponent
    ? "bg-pb_darkgray text-white "
    : "bg-white text-pb_darkgray border-b border-pb_lightgray";
    
  const titleClasses = isOpponent
    ? "text-pb_lightestgray"
    : "text-pb_textgray";
    
  const totalClasses = isOpponent
    ? "text-white"
    : "text-pb_textgray";
    
  const adjustmentClasses = isOpponent
    ? "text-pb_bluehover"
    : "text-pb_bluehover";

  return (
    <Card className={`rounded-t-lg flex-1 rounded-b-none border-1.5 shadow-inner flex flex-col h-full min-w-0 ${containerClasses}`}>
      <CardHeader className={`h-9 flex flex-row items-center justify-between p-0 px-3 flex-shrink-0 rounded-t-lg ${headerClasses}`}>
        <CardTitle className={`text-2xs font-bold uppercase tracking-wider leading-none ${titleClasses}`}>{type}</CardTitle>
        <div className={`text-md font-bold leading-none flex items-center !m-0 ${totalClasses}`}>{total.toLocaleString()}</div>
      </CardHeader>
      <CardContent className="p-2 flex-1 overflow-y-auto ">
        <div className="flex flex-col gap-1">
          {players.map((player, index) => (
            isOpponent ? (
              <OpponentPlayerRow key={index} player={player} />
            ) : (
              <TradePlayerRow key={index} player={player} />
            )
          ))}
          {valueAdjustment > 0 && (
            <div className={`bg-pb_bluedisabled/20 rounded-md border border-pb_blue/30`}>
              <div 
                className="flex items-center justify-between px-1.5 pr-2 h-9 cursor-pointer"
                onClick={() => setIsAdjustmentExpanded(!isAdjustmentExpanded)}
              >
                <div className={`flex items-center space-x-1.5 min-w-0 ${adjustmentClasses}`}>
                  <div className="w-icon h-icon flex-shrink-0 flex items-center justify-center">
                    <Scale className={`w-icon-sm h-icon-sm ${adjustmentClasses}`} />
                  </div>
                  <span className={`text-button font-semibold truncate ${adjustmentClasses}`}>Value Adjustment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-11 text-right text-button font-semibold ${adjustmentClasses}`}>+{valueAdjustment}</span>
                  <ChevronDown className={cn(`w-icon-sm h-icon-sm mr-1 transition-transform ${adjustmentClasses}`, isAdjustmentExpanded ? 'rotate-180' : '')} />
                </div>
              </div>
              
              {isAdjustmentExpanded && (
                <div className="p-3 border-t border-pb_mddarkgray bg-pb_textgray">
                  <div className="text-white space-y-2">
                    <div className="text-2xs font-semibold text-pb_lightestgray">ADJUSTMENT DETAILS</div>
                    <div className="text-button">
                      <div className="flex justify-between">
                        <span>Reason:</span>
                        <span className="text-pb_lightestgray">Player count difference</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Formula:</span>
                        <span className="text-pb_lightestgray">+{valueAdjustment} per extra slot</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Applied to:</span>
                        <span className="text-pb_lightestgray">{type.split(' ')[1]} side</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
  <div className="w-full h-full flex flex-col space-y-2.5">
    <div className="flex h-button flex-shrink-0">
      <TradeControlsPanel />
    </div>
         <div className="flex-1 flex justify-center gap-4 min-h-0">
      <TradePanel type="YOU SEND" players={sendPlayers} total={sendTotal} valueAdjustment={sendAdjustment} />
      <TradePanel type="YOU RECEIVE" players={receivePlayers} total={receiveTotal} valueAdjustment={receiveAdjustment} />
    </div>
  </div>
  );
} 