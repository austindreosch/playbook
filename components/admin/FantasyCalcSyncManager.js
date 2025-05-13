'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';
import UnmatchedPlayerResolver from './UnmatchedPlayerResolver';

export default function FantasyCalcSyncManager() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resultsSummary, setResultsSummary] = useState(null);
  const [unmatchedPlayers, setUnmatchedPlayers] = useState([]);
  const [error, setError] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('Starting FantasyCalc NFL rankings sync...');
    setError('');
    setResultsSummary(null);
    setUnmatchedPlayers([]);

    try {
      const response = await fetch('/api/admin/syncFantasyCalcRankingsRoute', { 
        method: 'POST', 
      });

      const data = await response.json();

      if (!response.ok || data.error || !data.success) {
        throw new Error(data.message || data.error || 'Sync failed');
      }

      setMessage('FantasyCalc NFL sync completed successfully!');
      setResultsSummary(data.results);

      const playerNamesToResolve = data.results?.details?.reduce((acc, detail) => {
        if (detail.unmatchedPlayers && detail.unmatchedPlayers.length > 0) {
          detail.unmatchedPlayers.forEach(p => acc.push({ ...p, variant: detail.variant })); 
        }
        return acc;
      }, []) || [];
      
      const uniqueUnmatchedPlayers = playerNamesToResolve.filter((player, index, self) =>
         index === self.findIndex((p) => p.name === player.name)
      );
      
      setUnmatchedPlayers(uniqueUnmatchedPlayers);

    } catch (err) {
      console.error("Sync error:", err);
      setError(`Error: ${err.message}`);
      setMessage('Sync failed. Check console for details.');
      setUnmatchedPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerLinked = (linkedPlayerName) => {
    setUnmatchedPlayers(currentList => 
        currentList.filter(p => p.name !== linkedPlayerName)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FantasyCalc Rankings Sync (NFL)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Sync all 12 NFL Points ranking variants (Dynasty/Redraft, Standard/Superflex, 0/0.5/1 PPR) from FantasyCalc.
        </p>
        <Button onClick={handleSync} disabled={loading}>
          {loading ? 'Syncing...' : 'Sync NFL FantasyCalc Rankings Now'}
        </Button>
        {loading && <Progress value={null} className="w-full" />} 
        {message && <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        
        {unmatchedPlayers.length > 0 && (
          <div className="mt-2 w-full border-t pt-2">
            <p className="text-xs font-semibold mb-1">Unmatched Players Needing Resolution ({unmatchedPlayers.length}):</p>
            <ul className="text-xs space-y-1 max-h-96 overflow-y-auto bg-gray-50 p-1 rounded">
              {unmatchedPlayers.map((player) => (
                <UnmatchedPlayerResolver 
                  key={player.name} 
                  player={{ name: player.name, rank: player.rank || 'N/A' }}
                  sport={'nfl'}
                  onPlayerLinked={handlePlayerLinked}
                />
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 