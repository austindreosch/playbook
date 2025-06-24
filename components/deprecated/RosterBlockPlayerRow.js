// 'use client'
// /* eslint-disable @next/next/no-img-element */

// import { faCalendarDays, faClock, faFlag, faForward, faSackDollar, faSliders } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React, { createRef, useRef, useState } from 'react';
// import RankDonut from '../components/RankDonut';

// import Image from 'next/image';

// /* -----------------------------------------------------------
//     GENERATE COLORS FOR PLAYER STATS
// ----------------------------------------------------------- */

// function getColorForStat(value, average) {
//     // Define weight/ranges) inside the function
//     const eliteRange = average * 1.10; // Well above average
//     const goodRange = average * 1.02; // Slightly above average
//     const poorRange = average * 0.85; // Slightly below average
//     const badRange = average * 0.7; // Well below average

//     if (value >= eliteRange) return 'bg-green-300';
//     if (value >= goodRange) return 'bg-green-100';
//     if (value >= average) return 'bg-green-50';
//     if (value >= poorRange) return 'bg-red-100';
//     return 'bg-red-300';
// } 

// //For turnovers, lower is better:
// function getColorForTO(value, average) {
//     const eliteRange = average * 0.8;
//     const goodRange = average * 0.9;
//     const badRange = average * 1.1;

//     if (value <= eliteRange) return 'bg-green-300';
//     if (value <= goodRange) return 'bg-green-200';
//     if (value <= average) return 'bg-green-100';
//     if (value <= badRange) return 'bg-red-100';
//     return 'bg-red-300';
// }

// /* ------------------------------------------------------------ */

// function RosterBlockPlayerRow({ player, index }) {
//     const [collapsed, setCollapsed] = useState(true);
//     const [activeTab, setActiveTab] = useState(0); // each player starts with tab 0 (current season) active
//     const [selectedFavor, setSelectedFavor] = useState('Neutral');
//     const [selectedFaith, setSelectedFaith] = useState('Neutral');
//     const [selectedSmart, setSelectedInjuryProne] = useState('Neutral');

//     /* ----------------------
//         HELPER FUNCTIONS
//     ------------------------ */

//     const toggleCollapse = () => {
//         setCollapsed(!collapsed);
//     };

//     const renderButtonGroup = (options, selected, setSelected) => (
//     <div className="space-x-1 ml-1">
//         <div className="bg-white rounded-lg border border-gray-200 py-0.5 shadow-sm w-full grid grid-cols-3">
//         {options.map((option, index) => (
//             <button
//             key={index}
//             type="button"
//             className={`col-span-1 rounded-md ${selected === option ? 'bg-gray-400' : 'bg-white'} px-1 py-1 text-center text-xs font-medium ${selected === option ? 'text-white' : 'text-secondary-700'} hover:bg-myotherblue`}
//             onClick={() => setSelected(option)}
//             >
//             <p>{option}</p>
//             </button>
//         ))}
//         </div>
//     </div>
//     );
                

//     return (
//         <div key={index} className="border border-gray-100 my-[.25rem] shadow-sm">

//             {/* ---------------------
//                 UNCOLLAPSED ROW 
//             -----------------------*/}
//             <div 
//                 className="text-lg font-medium px-1 cursor-pointer grid grid-cols-[3fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr]" 
//                 onClick={() => toggleCollapse()}>

//                 <div className="col-span-3 grid grid-cols-8">
//                     <span className="col-span-1 flex-1 text-center mt-[.3rem]"><span className='text-gray-400 text-sm mx-[1px]'>#</span>{player.info.dynastyRank}</span>
//                     <span className="col-span-1 flex-1 text-center mt-[.3rem] font-bold text-mybrightorange">{player.playbookScore}</span>
//                     <div className="col-span-1 h-8 w-8 inline-flex items-center justify-center mr-2 my-[3px] mx-1">
//                         <img className='bg-gray-200 rounded-md' src={player.info.img ? player.info.img : 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-512x488-rddkk3u9.png'} alt="player pic"/>
//                     </div>
//                     <div className='col-span-5 ml-1 mt-1'>
//                         <div className='text-sm leading-tight'>{player.name}</div>
//                         <div className='text-2xs text-gray-400 leading-tight'>
//                         {player.position}  ·  {player.team}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-span-7 flex items-center text-xs gap-[2px] overflow-hidden">
//                     <span className={`border border-gray-100 rounded-sm flex-1 text-2xs py-[5px] text-center ${getColorForStat(parseFloat(player.stats.fgPct), 49.1)}`}>{player.stats.fgPct}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.fg3PtMadePerGame, 1.63)}`}>{player.stats.fg3PtMadePerGame}</span>
//                     {/* <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.TPM, 1.63)}`}>{player.stats.TPM}</span> */}
//                     <span className={`border border-gray-100 rounded-sm flex-1 text-2xs py-[5px] text-center ${getColorForStat(parseFloat(player.stats.ftPct), 80.0)}`}>{player.stats.ftPct}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.ptsPerGame, 17.11)}`}>{player.stats.ptsPerGame}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.rebPerGame, 6.4)}`}>{player.stats.rebPerGame}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.astPerGame, 3.97)}`}>{player.stats.astPerGame}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.stlPerGame, 0.96)}`}>{player.stats.stlPerGame}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForStat(player.stats.blkPerGame, 0.64)}`}>{player.stats.blkPerGame}</span>
//                     <span className={`border border-gray-100 rounded-sm flex-1 py-[5px] text-center ${getColorForTO(player.stats.toPerGame, 1.96)}`}>{player.stats.toPerGame}</span>
//                 </div> 
//             </div>

//             {/* --------------------------
//                     COLLAPSED DISPLAY
//             ----------------------------*/}
//             {!collapsed && (
//                 <div className={`grid grid-cols-18 bg-gray-100 border  border-gray-200 transition-max-height duration-500 ease-in-out overflow-y-hidden gradient-shadow ${collapsed[index] ? 'max-h-0' : 'max-h-[10.7rem]'}`}>
//                     <div className='col-span-2'>
//                         {/* ---------------------
//                             RANKINGS BREAKDOWN 
//                         ------------------------*/}
//                         <div className="m-auto flex justify-center items-center pt-[.1rem] mb-[.06rem] mt-[.7rem]">
//                             <ul className="bg-white divide-y grid grid-rows-3 divide-gray-200 rounded-lg border border-gray-200 shadow-sm text-center text-3xs leading-tight mx-1 w-full ">
//                                 <li className=" flex justify-center items-center p-1 leading-none">
//                                     <div>
//                                         <h4>rank</h4>
//                                         <p className='text-lg' ><span className='text-gray-500 text-sm'>#</span>{player.info.dynastyRank}</p>
//                                     </div>
//                                 </li>
//                                 <li className=" flex justify-center items-center p-1 leading-none">
//                                     <div>
//                                         <h4 >consensus</h4> 
//                                         <p className='text-lg'><span className='text-gray-500 text-sm'>#</span> {player.info.dynastyRank + Math.floor(Math.random() * 11 - 5)}
//                                         </p>
//                                     </div>
//                                 </li>
//                                 <li className=" flex justify-center items-center p-1 leading-none">
//                                     <div>
//                                     <h4 >standard</h4>
//                                     <b className=' text-lg text-mybrightorange'>{player.playbookScore}</b>
//                                     </div>
//                                 </li> 
//                             </ul>
//                         </div>
//                     </div>
//                     <div className='col-span-4 h-[10rem] py-1 pt-3 pl-1'>
//                         <RankDonut score={player.playbookScore} age={player.info.age} dynastyRank={player.info.dynastyRank}/>
//                     </div>
//                     <div className='col-span-12  ml-1 m-1 max-h-[9.2rem] '>
//                         <div className=' grid grid-rows-8  bg-white  rounded-lg  border border-gray-200 shadow-md h-full '>
//                             <div className='grid grid-cols-21 row-span-6 pl-2 h-full text-2xs text-right'>
//                                 {/* ---------------------
//                                      PLAYER PROFILE 
//                                 ------------------------*/}
//                                 <div className='col-span-2 my-auto '>
//                                     <div> <FontAwesomeIcon icon={faCalendarDays} /> <b className='text-center ml-0.5'>AGE</b>  </div>
//                                     <div> <FontAwesomeIcon icon={faClock} /> <b className='text-center'>MIN</b>  </div>
//                                     <div> <FontAwesomeIcon icon={faForward} /> <b className='text-center '>GP</b>  </div>
//                                     <div> <FontAwesomeIcon icon={faFlag} /> <b className='text-center '>INJ</b>  </div>
//                                     {/* <div> <FontAwesomeIcon icon={faSackDollar} /> <b className='text-center '>SAL</b>  </div> */}
//                                 </div>
//                                 <div className='col-span-2 ml-1 my-auto'>
//                                     <div className='flex justify-center items-center'> <span > {player.info.age}</span> </div>
//                                     <div className='flex justify-center items-center'> <span> {player.info.minPerGame}</span> </div>
//                                     <div className='flex justify-center items-center'> <span> {player.stats.gamesPlayed}</span> </div>
//                                     <div className='flex justify-center items-center'> <span>  {player.info.injStatus && player.info.injStatus.injuryDescription
//                                         ? <div style={{ width: '27px', height: '15px', backgroundColor: 'red', borderRadius: '5px' }}></div>
//                                         : <div style={{ width: '27px', height: '16px', backgroundColor: 'lightgreen', borderRadius: '5px' }}></div>}
//                                     </span> </div>
//                                 </div>
//                                 <div className="col-span-5 w-24 h-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 align-middle m-2 mx-4">
//                                     <img 
//                                         className="w-full h-full object-cover object-center" 
//                                         src={player.info.img ? player.info.img : 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-512x488-rddkk3u9.png'} 
//                                         alt="player pic" 
//                                     />
//                                 </div>
//                                 <div className='col-span-12 flex pr-1 mr-2 '>
//                                     <div className=' grid grid-flow-row align-center my-auto w-full'>
//                                         {renderButtonGroup(['Favor', 'Neutral', 'Dislike'], selectedFavor, setSelectedFavor)}
//                                         {renderButtonGroup(['Faith', 'Neutral', 'Doubt'], selectedFaith, setSelectedFaith)}
//                                         {renderButtonGroup(['Prone', 'Neutral', 'Ironman'], selectedSmart, setSelectedInjuryProne)}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='row-span-2  text-center rounded-md'>
//                             {/* -----------------------------------------------
//                                    ACTIVE TAB SELECTION (NOT IMPLEMENTED) 
//                             --------------------------------------------------*/}
//                             <div className='flex justify-center middle-align bg-gray-100 rounded-md border border-gray-300 rounded-b-md h-[102%]'>
//                                 <div className="overflow-hidden rounded-md my-auto">
//                                     <ul className="grid items-center rounded-md gap-4 grid-flow-col font-3xs md:text-xs font-medium my-0.5">
//                                         {['Player Info', 'Last 30', 'Last 60', 'Last Season', 'Last 2 Seasons'].map((tab, index) => {
//                                             const isActive = activeTab === index;
//                                             const disabledStyle = isActive ? '' : 'opacity-50 cursor-not-allowed';

//                                             return (
//                                                 <li key={index} className='my-auto bg-gray-200'>
//                                                     <a
//                                                         onClick={isActive ? () => setActiveTab(index) : undefined}
//                                                         className={`inline-flex items-center bg-gray-200 gap-2 rounded-md p-1 md:p-1.5 ${
//                                                             isActive ? 'bg-myblue text-white shadow-md' : ''
//                                                         } hover:bg-myblue hover:text-white hover:shadow ${disabledStyle}`}
//                                                     >
//                                                         {tab}
//                                                     </a>
//                                                 </li>
//                                             );
//                                         })}
//                                     </ul>
//                                 </div>
//                             </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>

//     )
// }


// export default RosterBlockPlayerRow;