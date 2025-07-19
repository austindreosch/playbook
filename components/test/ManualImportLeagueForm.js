// ImportLeagueForm.js
'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ManualLeagueForm({ userId }) {
  const { user } = useUser();
  const router = useRouter();
  const [providerLeagueId, setLeagueId] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedScoring, setSelectedScoring] = useState('');
  const [step, setStep] = useState('initial');
  const [leagueData, setLeagueData] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [leagueTeamCount, setLeagueTeamCount] = useState(null);



  // handle
  const handleImportLeague = async (e) => {
    e.preventDefault();
    try {
      const leagueInfo = await getLeagueDataForImport(providerLeagueId, leagueName, selectedProvider);
      setLeagueData(leagueInfo);
  
      const teamCount = leagueInfo.leagueTeamCount;
      setLeagueTeamCount(teamCount);

      const teams = leagueInfo.teams;
      const teamNames = [];
  
      for (const team of teams) {
        teamNames.push(team.teamName);
      }
      setAvailableTeams(teamNames);
  
      setStep('teamSelect');
    } catch (error) {
      console.error(error);
    }
  };
  

  

    return (
      <div className="mx-auto max-w-xl bg-white p-5 px-8 w-[300rem] rounded-lg shadow-md h-[48.5rem]">
        <div>
          <form onSubmit={handleImportLeague} className="flex flex-col items-center space-y-4">
            {/* question 1 */}
            <label htmlFor="sport" className=" block text-sm font-medium text-gray-700">Sport</label>

            <div className="inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
              <button 
                type="button"
                onClick={() => setSelectedSport('NBA')}
                className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedSport === 'NBA' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
              >
                NBA
              </button>
              <button
                type="button"
                onClick={() => {}} // setSelectedSport('MLB')
                className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
                disabled
              >
                MLB
              </button>
              <button
                type="button"
                onClick={() => {}} // setSelectedSport('NFL')
                className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
                disabled
              >
                NFL
              </button>
            </div>

            {/* question 2 */}
            <label htmlFor="leagueName" className=" mt-2 block text-sm font-medium text-gray-700 ">League Name</label>
            <input 
              type="text"
              id="leagueName"
              name="leagueName"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)} 
              className="max-w-xs block w-full rounded-md shadow-md border border-gray-100 p-1 focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="The League" />

            {/* question 3 */}
            <label htmlFor="provider" className=" block text-sm font-medium text-gray-700">Scoring</label>

            <div className="inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
              <button 
                type="button"
                onClick={() => setSelectedScoring('H2H Categories')}
                className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedScoring === 'H2H Categories' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
              >
                H2H Categories
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
                disabled
              >
                H2H Points
              </button>

            </div>


            {/* question 4 */}
            <label htmlFor="format" className=" block text-sm font-medium text-gray-700">League Format</label>

            <div className="mb-10 inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
              <button 
                type="button"
                onClick={() => setSelectedFormat('Dynasty')}
                className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedFormat === 'Dynasty' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
              >
                Dynasty
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('Redraft')}
                className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedFormat === 'Redraft' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
                >
                Redraft
              </button>
            </div>

              
            {/* button */}
            <div className='pt-7'>
              <button type="submit" className=" inline-flex items-center gap-1.5 rounded-lg border border-primary-500 bg-myblue px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                Import League
              </button>
            </div>
          </form>

        </div>
      </div>

  );

}



