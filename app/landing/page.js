import Features from '@/components/LandingPage/features'
import FeaturesBlocks from '@/components/LandingPage/features-blocks'
import Hero from '@/components/LandingPage/hero'
import Newsletter from '@/components/LandingPage/newsletter'
import Testimonials from '@/components/LandingPage/testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturesBlocks />
      <Testimonials />
      <Newsletter />
    </>
  )
}




// -----------------------------------
// -----------------------------------
// -----------------------------------

// import Image from 'next/image';
// import Link from 'next/link';

// import { Figtree, Lexend_Deca } from 'next/font/google';
// const oldFont = Lexend_Deca({
//     weight: '400',
//     subsets: ['latin'],
//     display: 'swap',
// })

// import { Bai_Jamjuree, Do_Hyeon, Hammersmith_One, Homenaje, Major_Mono_Display, Titillium_Web } from 'next/font/google';
// const logoFont = Titillium_Web({
//     weight: '400',
//     subsets: ['latin'],
//     display: 'swap',
// })
// const aiFont = Hammersmith_One({
//     weight: '400',
//     subsets: ['latin'],
//     display: 'swap',
// })

// export default function Page() {


//     return (
//         <div className="flex items-center justify-center bg-white ">
//             <div className="grid grid-cols-1 lg:grid-cols-12 bg-white gap-6">
//                 <div className="z-10 col-span-12 lg:col-span-5 px-5 py-5 sm:py-12 max-w-[37rem] mx-auto align-middle bg-white rounded-lg">
//                     <p className="text-5xl font-bold text-mydarktext">Dominate your leagues <br /> and waste less time.</p>
//                     <p className="py-2 text-mydarktext">Playing fantasy sports shouldn&apos;t feel like a full-time job. That&apos;s why we&apos;ve created Playbook AI, the single dashboard for all things fantasy sports strategy which leverages the power of AI and user-customized data analytics to provide you unprecedented clarity and insight.</p>


//                     <div className="mx-auto max-w-[37rem] my-6">
//                         <ul className="space-y-4">
//                             <li className="flex gap-4">
//                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-primary-500">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
//                                     </svg>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h4 className="text-lg font-medium leading-normal text-mydarktext">Customize analysis to your own value system</h4>
//                                     <p className="text-gray-500 text-sm">Have a good feeling about a player? Prefer young players for a rebuild? Does an opposing owner seem a little too eager to make a good player available? Playbook tracks every piece of data you feed it and defines a powerful customized dataset.</p>
//                                 </div>
//                             </li>
//                             <li className="flex gap-4">
//                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-primary-500">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
//                                     </svg>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h4 className="text-lg font-medium leading-normal text-mydarktext">Find smart trades and exploit hidden value</h4>
//                                     <p className="text-gray-500 text-sm">Contrast your custom dataset against the community standard and exploit the differences. Playbook does the thinking for you and displays all your options in real-time across all your leagues, providing unprecedented clarity of all opportunity.</p>
//                                 </div>
//                             </li>
//                             <li className="flex gap-4">
//                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-primary-500">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
//                                     </svg>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h4 className="text-lg font-medium leading-normal text-mydarktext">Get expert analysis and data-driven suggestions</h4>
//                                     <p className="text-gray-500 text-sm">Playbook makes sure you&apos;re never alone in your decision-making. Leverage our expert rankings synchronized to your league&apos;s unique dynamics as your secret weapon for consistent success.</p>
//                                 </div>
//                             </li>
//                         </ul>
//                     </div>

//                     <div className="flex items-center justify-center py-3 bg-gray-100 rounded-lg">
//                         <Link href="/api/auth/login">
//                             <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300">

//                                 Get Started
//                             </button>
//                         </Link>
//                     </div>
//                 </div>

//                 <div className="col-span-12 lg:col-span-7 text-center py-5 max-w-3xl mx-auto lg:mx-0 lg:mt-0 w-screen lg:h-auto relative">
//                     <div className="z-0 shadow-md rounded-lg ">
//                         <Image src="/heroimg.png" alt="Description of Image" className="w-full shadow-md rounded-lg object-cover min-w-fit" layout="responsive" width={100} height={100} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }