// import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip);


// function calculateValueBasedOnAgeAndRank(age, dynastyRank) {
//   const peakPerformanceAge = 27;

//   // Calculate age factor. This will yield values between 0 and 1.
//   let ageFactor = 1 - Math.pow((age - peakPerformanceAge) / 10, 2);
//   ageFactor = Math.max(0, ageFactor);  // ensures it never goes below 0

//   // Adjust the influence of dynasty rank.
//   let rankFactor = (101 - dynastyRank) / 100;

//   // Here, we'll balance age and rank for potential value.
//   let potentialValue = age < peakPerformanceAge ? rankFactor : rankFactor * ageFactor;

//   // Production is the inverse of potential.
//   const productionValue = 1 - potentialValue;

//   return {
//       production: Math.round(productionValue * 100),
//       potential: Math.round(potentialValue * 100)
//   };
// }


// export function RankDonut({score, age, dynastyRank}) {
//   const { production, potential } = calculateValueBasedOnAgeAndRank(age, dynastyRank);

//   const data = {
//     labels: ['Production', 'Potential',],
//     datasets: [
//       {
//         // label: '# of Votes',
//         data: [production, potential],
//         backgroundColor: [
//           'rgba(54, 162, 235, 1)',
//           'rgb(255, 209, 102, 1)',
//           'rgba(255, 159, 64, 1)',
//         ],
//         borderColor: 'lightgray',
//         borderWidth: 0,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: true, // This will make the chart use the full height of its container
//     layout: {
//       width: '100%',  // or desired width
//       height: '100%', // or desired height
//     }
//   };
//   return (
//     <div className='w-full h-full flex align-middle justify-center relative'> {/* Add 'relative' here */}
//       <Doughnut data={data} options={options}/>
//       <h1 
//           className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-4xl font-bold text-mybrightorange stroke-slate-800'
//           style={{ zIndex: '900 !important' }}
//       >
//           {score}
//     </h1>
//     </div>
//   )
// }

// export default RankDonut;