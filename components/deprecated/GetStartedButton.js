// 'use client'

// import { useRouter } from 'next/router';


// import React from 'react';

// export default function GetStartedButton() {
//     const router = useRouter();
//     const session = useSession();
//     const user = session?.user;
  
//     const handleClick = () => {
//       if (!user) {
//         router.push('/login');
//       } else {
//         router.push('/');
//       }
//     };
  
//     return (
//       <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300" onClick={handleClick}>
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
//           <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
//           <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
//         </svg>
//         Get Started
//       </button>
//     );
//   }
