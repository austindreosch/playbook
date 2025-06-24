// 'use client'

// // RosterBlock.js
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Link from 'next/link';
// import React, { useCallback, useEffect, useState } from 'react';
// import { ThreeCircles } from 'react-loader-spinner';
// import RosterBlockPlayerRow from './RosterBlockPlayerRow';
// // import { calculateScore } from '../utilities/calculateScore';

// function RosterBlock() {
//     const { user, isLoading } = useUser();
//     const [leaguesData, setLeaguesData] = useState([]);
//     const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0); // Defaults to the first imported league

//     const [noLeagues, setNoLeagues] = useState(false);

//     useEffect(() => {
//       const fetchLeaguesData = async () => {
//         if (!user) return;

//         try {
//           const response = await fetch(`/api/load/leagues?userAuthId=${user.sub}&sport=NBA`); //sport will later be dynamic
//           if (response.ok) {
//             const leagues = await response.json();
//             setLeaguesData(leagues);
//           } else {
//             setNoLeagues(true);
//             console.error('No league data found for the user.');
//           }
//         } catch (error) {
//           console.error('Error fetching leagues data:', error);
//         }
//       };

//       fetchLeaguesData();
//     }, [user]);

//     if (!isLoading && noLeagues === true){
//         return <div className='p-2 px-4 inline-block bg-myblue text-white rounded-md mx-1 my-auto mt-48'>
//             <Link className={`font-bold`} href="/import">No leagues found. Please import league to continue.</Link>
//         </div>
//     }
//     if (isLoading) {
//         return <div className='my-auto pt-32'>
//             <ThreeCircles
//                 height="200"
//                 width="200"
//                 color="#42a9e0"
//                 wrapperStyle={{}}
//                 wrapperClass=""
//                 visible={true}
//                 ariaLabel="three-circles-rotating"
//                 outerCircleColor=""
//                 innerCircleColor=""
//                 middleCircleColor=""
//             />
//         </div>
//     }
//     if (!user) return;

//     const selectedLeague = leaguesData[selectedLeagueIndex];
//     const selectedTeam = selectedLeague ? selectedLeague.teams.find(team => team.teamId === selectedLeague.userTeamId) : null;
    
//     if (!selectedLeague) {
//         return <div className='my-auto pt-32'>
//             <ThreeCircles
//                 height="200"
//                 width="200"
//                 color="#42a9e0"
//                 wrapperStyle={{}}
//                 wrapperClass=""
//                 visible={true}
//                 ariaLabel="three-circles-rotating"
//                 outerCircleColor=""
//                 innerCircleColor=""
//                 middleCircleColor=""
//             />
//         </div>
//     }

//     return (
//         <div className="bg-white rounded-md shadow-md overflow-y-scroll hide-scrollbar p-4 mx-1 h-full">
//             {/* COMPONENT HEADER */}
//             <div className='flex items-center py-2'> 
//                 <h2 className="text-2xl leading-9 font-bold text-gray-900 mb-1 mr-4">{selectedTeam.teamName}</h2>
//                 <div className="flex flex-col justify-center">
//                     <div className="flex items-center ml-4">
//                         <h4 className='text-sm mb-1 mr-2'>
//                             {selectedLeague.leagueScoring} • {selectedLeague.leagueSport} • {selectedLeague.leagueFormat} • {selectedLeague.teams.length} Team  • {selectedLeague.leagueProvider}
//                         </h4>
//                         <select
//                             id="team-selector"
//                             value={selectedLeagueIndex}
//                             onChange={(e) => setSelectedLeagueIndex(e.target.value)}
//                             className="border ml-4 rounded py-1 mb-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         >
//                             {leaguesData.map((league, index) => (
//                                 <option key={index} value={index}>
//                                     {league.leagueName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>
//             {/* TABLE HEADER */}
//             <div className="bg-black text-white text-xs py-[3px] rounded-sm grid grid-cols-[3fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] mb-1 pr-1">
//                 <div className="col-span-3 font-bold pl-1 flex items-center justify-start">RANK</div>
//                 <div className="col-span-7 grid grid-cols-9 font-bold">
//                     <span className="text-center p-1">FG%</span>
//                     <span className="text-center p-1">3PM</span>
//                     <span className="text-center p-1">FT%</span>
//                     <span className="text-center p-1">PTS</span>
//                     <span className="text-center p-1">REB</span>
//                     <span className="text-center p-1">AST</span>
//                     <span className="text-center p-1">ST</span>
//                     <span className="text-center p-1">BLK</span>
//                     <span className="text-center p-1">TO</span>
//                 </div>
//             </div>
//             {/* RENDER PLAYER ROWS */}    
//             {selectedTeam && selectedTeam.players
//                 .sort((a, b) => b.playbookScore - a.playbookScore)
//                 .map((player, playerIndex) => (
//                     <RosterBlockPlayerRow key={playerIndex} player={player} index={playerIndex} />
//             ))}
//         </div>
//     );
    
// }

// export default RosterBlock;
