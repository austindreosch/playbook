import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TradePlayerRow from "../TeamBlock/TradePlayerRow";
import ControlsPanel from "./ControlsPanel";

const TradePanel = ({ type, players, total, valueAdjustment }) => {
  return (
    <Card className="flex-1 bg-gray-50 p-2 rounded-lg border shadow-md flex flex-col max-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between p-2 mb-2 flex-shrink-0">
        <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">{type}</CardTitle>
        <div className="text-lg font-bold text-gray-800">{total.toLocaleString()}</div>
      </CardHeader>
      <CardContent className="p-2 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {players.map((player, index) => (
            <TradePlayerRow key={index} player={player} />
          ))}
          {type === "SEND" && valueAdjustment && (
            <div className="flex items-center justify-between bg-gray-600 text-white p-2 rounded-md mt-2">
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
  // TODO: Replace with dynamic data
  const sendPlayers = [
    { name: 'Giannis Antetokounmpo', value: 8576 },
    { name: 'Clint Capela', value: 3274, status: 'target' },
  ];
  const receivePlayers = [
    { name: 'Shai Gilgeous-Alexander', value: 7653 },
    { name: 'Jalen Brunson', value: 6574, status: 'bullseye' },
    { name: 'Bam Adebayo', value: 5893 },
  ];
  const sendTotal = 12178;
  const receiveTotal = 20120;

  return (
    <div className="w-full h-full rounded-lg flex items-stretch justify-center gap-4 p-4">
      <TradePanel type="SEND" players={sendPlayers} total={sendTotal} valueAdjustment={328} />
      <ControlsPanel />
      <TradePanel type="RECEIVE" players={receivePlayers} total={receiveTotal} />
    </div>
  );
} 