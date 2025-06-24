// // ImportLeagueForm.js
// 'use client'

// import { useUser } from '@auth0/nextjs-auth0/client';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { getLeagueData, getLeagueDataForImport } from '../utilities/fantraxAPI';

// /* -----------------------------------------------------------
//     MULTISTEP FORM COMPONENT FOR IMPORTING LEAGUES
// ----------------------------------------------------------- */

// export default function ImportLeagueForm({ userId }) {
//   const { user } = useUser();
//   const router = useRouter();
//   const [providerLeagueId, setLeagueId] = useState('');
//   const [leagueName, setLeagueName] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [selectedSport, setSelectedSport] = useState('');
//   const [selectedFormat, setSelectedFormat] = useState('');
//   const [selectedScoring, setSelectedScoring] = useState('');
//   const [step, setStep] = useState('initial');
//   const [leagueData, setLeagueData] = useState(null);
//   const [availableTeams, setAvailableTeams] = useState([]);
//   const [leagueTeamCount, setLeagueTeamCount] = useState(null);

//  /* --------------------------------------------------------------------------------------
//     Import all league data and cache in state for the next step
//  --------------------------------------------------------------------------------------- */
//   const handleImportLeague = async (e) => {
//     e.preventDefault();
//     try {
//       const leagueInfo = await getLeagueDataForImport(providerLeagueId, leagueName, selectedProvider);
//       setLeagueData(leagueInfo);
//       const teamCount = leagueInfo.leagueTeamCount;
//       setLeagueTeamCount(teamCount);
//       const teams = leagueInfo.teams;
//       const teamNames = [];
//       for (const team of teams) {
//         teamNames.push(team.teamName);
//       }
//       setAvailableTeams(teamNames);
//       setStep('teamSelect');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /* -------------------------------------------------------------------------------------------------------------------
//     Call getLeagueData() utility function with the gathered parameters, and save instance of the league to the database
//   ---------------------------------------------------------------------------------------------------------------------- */
//   const handleTeamSelection = async (e) => {
//     e.preventDefault();

//     const selectedTeamId = leagueData.teams.find((team) => team.teamName === selectedTeam)?.teamId || null;
//     const userAuthId = user.sub;
//     const uniqueLeagueId = `${userAuthId}_${providerLeagueId}`;

//     let data = await getLeagueData(uniqueLeagueId, providerLeagueId, selectedTeamId, userAuthId, leagueName, selectedProvider, selectedFormat, selectedSport, selectedScoring);
//     try {
//       const response = await fetch('/api/importleague', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data), 
//       });
//       router.push('/'); 
  
//       if (response.ok) {
//         console.log('League saved successfully!');
//       } else {
//         console.error('An error occurred while saving the league:', await response.text());
//       }
//     } catch (error) {
//       console.error('An error occurred while saving the league:', error);
//     }
//   };
  
//   // first phase of the form, where user inputs league info (sport, provider, league name, league ID, scoring, format)
//   if (step === 'initial') {
//     return (
//       <div className="mx-auto max-w-sm bg-white p-5 px-8 w-[22rem] rounded-lg shadow-md h-[48.5rem]">
//         <div>
//           <form onSubmit={handleImportLeague} className="flex flex-col items-center space-y-4">
//             {/* question 1 */}
//             <label htmlFor="sport" className=" block text-sm font-medium text-gray-700">Sport</label>

//             <div className="inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
//               <button 
//                 type="button"
//                 onClick={() => setSelectedSport('NBA')}
//                 className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedSport === 'NBA' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
//               >
//                 NBA
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {}} // setSelectedSport('MLB')
//                 className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
//                 disabled
//               >
//                 MLB
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {}} // setSelectedSport('NFL')
//                 className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
//                 disabled
//               >
//                 NFL
//               </button>
//             </div>

//             {/* question 2 */}
//             <label htmlFor="provider" className=" block text-sm font-medium text-gray-700">Provider</label>

//             <div className="inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
//               <button 
//                 type="button"
//                 onClick={() => setSelectedProvider('Fantrax')}
//                 className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedProvider === 'Fantrax' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
//               >
//                 Fantrax
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {}} // setSelectedProvider('Yahoo')
//                 className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
//                 disabled
//               >
//                 Yahoo
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {}} // setSelectedProvider('ESPN')
//                 className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
//                 disabled
//               >
//                 ESPN
//               </button>
//             </div>

//             {/* question 3 */}
//             <label htmlFor="leagueName" className=" mt-2 block text-sm font-medium text-gray-700 ">League Name</label>
//             <input 
//               type="text"
//               id="leagueName"
//               name="leagueName"
//               value={leagueName}
//               onChange={(e) => setLeagueName(e.target.value)} 
//               className="max-w-xs block w-full rounded-md shadow-md border border-gray-100 p-1 focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="The League" />

//             {/* question 4 */}
//             <label htmlFor="leagueId" className="mt-2 block text-sm font-medium text-gray-700 ">League ID</label>
//             <input 
//               type="text"
//               id="providerLeagueId"
//               name="providerLeagueId"
//               value={providerLeagueId}
//               onChange={(e) => setLeagueId(e.target.value)} 
//               className="block w-full rounded-md shadow-md border border-gray-100 p-1 focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="8wxrswqxljaxa2tz" />

//               {/* question 5 */}
//               <label htmlFor="provider" className=" block text-sm font-medium text-gray-700">Scoring</label>

//               <div className="inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
//                 <button 
//                   type="button"
//                   onClick={() => setSelectedScoring('H2H Categories')}
//                   className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedScoring === 'H2H Categories' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
//                 >
//                   H2H Categories
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {}}
//                   className="bg-white px-4 py-2.5 text-center text-sm font-medium text-secondary-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
//                   disabled
//                 >
//                   H2H Points
//                 </button>

//               </div>

//             {/* question 6 */}
//             <label htmlFor="format" className=" block text-sm font-medium text-gray-700">League Format</label>

//             <div className="mb-10 inline-flex -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
//               <button 
//                 type="button"
//                 onClick={() => setSelectedFormat('Dynasty')}
//                 className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedFormat === 'Dynasty' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
//               >
//                 Dynasty
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSelectedFormat('Redraft')}
//                 className={` px-4 py-2.5 text-center text-sm font-medium  ${selectedFormat === 'Redraft' ? 'bg-myblue text-white hover:bg-mydarkblue' : 'bg-white hover:bg-gray-100 text-secondary-700'}`}
//                 >
//                 Redraft
//               </button>
//             </div>

//             {/* complete form button */}
//             <div className='pt-7'>
//               <button type="submit" className=" inline-flex items-center gap-1.5 rounded-lg border border-primary-500 bg-myblue px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
//                   <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
//                   <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
//                 </svg>
//                 Import League
//               </button>
//             </div>
//           </form>
//           {/* Test User Helper */}
//           <div className='pt-6 text-center max-w-sm'>
//             <div className='bg-myorange p-2 rounded-md shadow-md'>
//               <div className="mb-2 text-xs text-back"><b>Don&apos;t have a League ID?</b> Try mine!</div>
//                 <div className='bg-white border border-gray-200 rounded-md grid row-span-2 justify-center align-middle p-1 shadow-lg'>
//                   <div className=" text-lg text-myblue"><b>8wxrswqxljaxa2tz</b></div>
//                   <div className=" text-2xs text-black">The League (12 Team, Dynasty, H2H, 9CAT)</div>
//                 </div>
//             </div>
//           </div>

//         </div>
//       </div>

//   );
//   } else if (step === 'teamSelect') {
//     // second phase of the form, where all teams are loaded for user choice before final import
    
//     return (
//       <div className="mx-auto bg-white p-6 w-[35rem] rounded-lg shadow-md h-[37rem]">
//         <div>
//           <form onSubmit={handleTeamSelection} className="flex flex-col items-center space-y-4">
//             <div className='grid grid-rows-8 h-[35rem]'>
//               <div className="text-center pb-2  items-center justify-center row-span-1">
//                 <div><p>{leagueName} • {leagueTeamCount} Team • {selectedFormat}</p></div>
//                 <div className='text-xl'><b>Select Your Team</b></div>
//               </div>
//               <div className={`my-auto grid grid-cols-3 gap-2 place-items-center row-span-6`}>
//               {availableTeams.map((teamName, index) => (
//                 <div key={index}>
//                   <button
//                     type="button"
//                     onClick={() => setSelectedTeam(teamName)}
//                     className={`m-1.5 text-center text-sm font-bold rounded-md p-3 ${selectedTeam === teamName ? 'bg-myorange text-black hover:bg-myotherorange hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
//                   >
//                     {teamName}
//                   </button>
//                 </div>
//               ))}
//               </div>
//               <div className='row-span-1 flex items-center justify-center '>
//                 <button type="submit" className=" inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
//                     <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
//                     <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
//                   </svg>
//                   Finalize Import
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }
// }



