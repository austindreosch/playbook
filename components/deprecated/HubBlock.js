// 'use client'

// import { faSliders } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React from 'react';
// // import UpdateStatsButton from './AdminButtons/UpdateNBAStatsButton';

// import { useUser } from '@auth0/nextjs-auth0/client';
// import Image from 'next/image';
// import Link from 'next/link';


// import { Figtree, Lexend_Deca } from 'next/font/google';
// const oldFont = Lexend_Deca({
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// })

// import { Bai_Jamjuree, Do_Hyeon, Hammersmith_One, Homenaje, Major_Mono_Display, Titillium_Web } from 'next/font/google';
// const logoFont = Titillium_Web({
//   weight: '600',
//   subsets: ['latin'],
//   display: 'swap',
// })
// const aiFont = Hammersmith_One({
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// })


// function HubBlock (){
//   const { user } = useUser();
//   console.log('User: ',user);


//   return (
//     <div className=" text-myblue bg-gray-50 rounded-md font-bold shadow-sm overflow-hidden my-1 mt-[5px] mx-2 p-2 max-w-[890px] mx-auto">


//       {user ? (
//         <div className=' flex justify-center items-center'>
//           <div className='p-2 px-4 inline-block bg-myblue text-white rounded-md mx-1 '>
//             <Link className={`${logoFont.className} font-bold`} href="/import">Import</Link>
//           </div>
//           <div className='p-2 px-4 inline-block bg-myorange text-black rounded-md mx-1 my-auto'>
//             <Link className={`${logoFont.className}`} href="#">Rankings</Link>
//           </div>
//           <div className='p-2 px-4 inline-block bg-myorange text-black rounded-md mx-1 my-auto'>
//             <Link className={`${logoFont.className}`} href="#">Settings</Link>
//           </div>
          
//           {/* <UpdateStatsButton/> */}
//         </div>
//       )
//       : () => null}




//     </div>
//   )
// }

// export default HubBlock;
