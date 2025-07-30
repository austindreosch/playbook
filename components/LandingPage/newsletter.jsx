'use client';

import React, { useState } from 'react';
import { Button } from "@/components/alignui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { 
    CheckCircle, 
    UserCheck, 
    ChevronRight,
    Sparkles
} from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Newsletter() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleSignUp = () => {
    if (isLoading) return;

    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pb-6 pt-8 md:pb-8">

          {/* CTA box */}
          <div className="relative bg-pb_orange p-12 shadow-lg overflow-hidden rounded-2xl" data-aos="zoom-y-out">

            <div className="relative flex flex-col lg:flex-row justify-between items-center">

              {/* Image */}
              <div className="hidden lg:block lg:w-1/3" aria-hidden="true">
                <div className="relative flex justify-center items-center">
                  <Image src="/logo-tpfull-big.png" alt="Playbook Icon" width={200} height={200} />
                </div>
              </div>

              {/* CTA content */}
              <div className=" w-full lg:w-2/3 lg:pl-12 space-y-3 text-center">
                <h3 className="text-3xl font-bold text-pb_darkgray">Ready to see what Playbook can do?</h3>
                <div className="py-2">
                  <p className="text-base font-medium text-pb_mddarkgray md:text-lg md:w-[80%] mx-auto">Start using Playbook early and see how it changes the way you manage your fantasy teams today.</p>
                </div>
                <div className="flex justify-center">
                  <Button
                    className="w-full p-5 px-7 shadow-md font-bold bg-pb_blue text-white hover:bg-pb_bluehover mb-4 sm:w-auto sm:mb-0 rounded-lg"
                    onClick={handleSignUp}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Sign Up Now'}
                  </Button>
                </div>
                  <p className="text-sm text-pb_mddarkgray">Use it free of charge for right now.</p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}


// export default function Newsletter() {
//   return (
//     <section>
//       <div className="max-w-6xl mx-auto px-4 sm:px-6">
//         <div className="pb-12 md:pb-20">

//           {/* CTA box */}
//           <div className="relative bg-gray-900 rounded py-8 px-4 md:py-16 md:px-12 shadow-2xl overflow-hidden" data-aos="zoom-y-out">

//             {/* Background illustration */}
//             <div className="absolute right-0 bottom-0 pointer-events-none hidden lg:block" aria-hidden="true">
//               <svg width="428" height="328" xmlns="http://www.w3.org/2000/svg">
//                 <defs>
//                   <radialGradient cx="35.542%" cy="34.553%" fx="35.542%" fy="34.553%" r="96.031%" id="ni-a">
//                     <stop stopColor="#DFDFDF" offset="0%" />
//                     <stop stopColor="#4C4C4C" offset="44.317%" />
//                     <stop stopColor="#333" offset="100%" />
//                   </radialGradient>
//                 </defs>
//                 <g fill="none" fillRule="evenodd">
//                   <g fill="#FFF">
//                     <ellipse fillOpacity=".04" cx="185" cy="15.576" rx="16" ry="15.576" />
//                     <ellipse fillOpacity=".24" cx="100" cy="68.402" rx="24" ry="23.364" />
//                     <ellipse fillOpacity=".12" cx="29" cy="251.231" rx="29" ry="28.231" />
//                     <ellipse fillOpacity=".64" cx="29" cy="251.231" rx="8" ry="7.788" />
//                     <ellipse fillOpacity=".12" cx="342" cy="31.303" rx="8" ry="7.788" />
//                     <ellipse fillOpacity=".48" cx="62" cy="126.811" rx="2" ry="1.947" />
//                     <ellipse fillOpacity=".12" cx="78" cy="7.072" rx="2" ry="1.947" />
//                     <ellipse fillOpacity=".64" cx="185" cy="15.576" rx="6" ry="5.841" />
//                   </g>
//                   <circle fill="url(#ni-a)" cx="276" cy="237" r="200" />
//                 </g>
//               </svg>
//             </div>

//             <div className="relative flex flex-col lg:flex-row justify-between items-center">

//               {/* CTA content */}
//               <div className="text-center lg:text-left lg:max-w-xl">
//                 <h3 className="h3 text-white mb-2">Want more tutorials & guides?</h3>
//                 <p className="text-gray-300 text-lg mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit nemo expedita voluptas culpa sapiente.</p>

//                 {/* CTA form */}
//                 <form className="w-full lg:w-auto">
//                   <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
//                     <input type="email" className="form-input w-full appearance-none bg-gray-800 border border-gray-700 focus:border-gray-600 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-gray-500" placeholder="Your email…" aria-label="Your email…" />
//                     <a className="btn text-white bg-blue-600 hover:bg-blue-700 shadow" href="#0">Subscribe</a>
//                   </div>
//                   {/* Success message */}
//                   {/* <p className="text-sm text-gray-400 mt-3">Thanks for subscribing!</p> */}
//                   <p className="text-sm text-gray-400 mt-3">No spam. You can unsubscribe at any time.</p>
//                 </form>
//               </div>

//             </div>

//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }