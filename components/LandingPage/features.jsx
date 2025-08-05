'use client'

import FeaturesElement from '@/public/images/features-element.png'
import FeaturesCard1 from '@/public/images/landing/featurescard1.png'
import FeaturesCard2 from '@/public/images/landing/featurescard2.png'
import FeaturesCard3 from '@/public/images/landing/featurescard3.png'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { BrainCog, CandlestickChart, Compass, PanelsTopLeft } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Features() {
  
  const [tab, setTab] = useState(1)

  const tabs = useRef(null)

  const heightFix = () => {
    if (tabs.current) {
      // Find the currently shown Transition component's inner div
      // This assumes the active (non-leaving) Transition component will not have opacity-0
      // and will be part of the normal layout flow to measure clientHeight correctly.
      let activeContent = null;
      if (tabs.current.children) {
        for (const transitionWrapper of Array.from(tabs.current.children[0].children)) {
          // Check the `show` prop based on the `tab` state for each Transition
          // This is a bit of a hack as we don't have direct access to Transition's internal state
          // We infer which Transition is active by its structure and the current `tab`.
          // This example assumes tab 1 maps to first Transition, tab 2 to second, etc.
          let correspondingTabState = 0;
          if (transitionWrapper.outerHTML.includes('show={tab === 1}')) correspondingTabState = 1;
          else if (transitionWrapper.outerHTML.includes('show={tab === 2}')) correspondingTabState = 2;
          else if (transitionWrapper.outerHTML.includes('show={tab === 3}')) correspondingTabState = 3;

          if (correspondingTabState === tab && transitionWrapper.firstElementChild) {
            activeContent = transitionWrapper.firstElementChild; // This is the div inside Transition
            break;
          }
        }
      }

      if (activeContent) {
        tabs.current.style.height = `${activeContent.clientHeight}px`;
      } else if (tabs.current.firstElementChild?.firstElementChild?.firstElementChild) {
        // Fallback if specific active content isn't found, use the first one's inner div
        tabs.current.style.height = `${tabs.current.firstElementChild.firstElementChild.firstElementChild.clientHeight}px`;
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => heightFix(), 50); // Run after a short delay
    window.addEventListener('resize', heightFix);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', heightFix);
    };
  }, [tab]);

  return (
    <section id="features" className="relative">

      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div className="absolute inset-0 bg-pb_backgroundgray pointer-events-none" aria-hidden="true"></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-pb_lightergray transform -translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 pb-10 sm:px-6">
        <div className="pt-12 md:pt-20">

          {/* Section header */}
          <div className="max-w-4xl mx-auto text-center pb-12">
            <h1 className="h2 font-bold mb-6 text-title-h2 text-pb_darkgray">The Ultimate Command Center for Fantasy</h1>
            <p className="text-paragraph-xl text-pb_midgray w-4/5 mx-auto">Get rid of the scattered spreadsheets, trade calculators, and talking heads. Playbook gives you everything you need to analyze, strategize, and dominate in one place.</p>
          </div>

          <Separator className='bg-pb_lightgray  h-[1px] mb-7'/>

          {/* Section content */}
          <div className="md:grid md:grid-cols-12 md:gap-6">

            {/* Content */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6">
              <div className="text-center px-4 md:text-left md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                <h3 className="h3 mb-3 text-title-h4 text-pb_darkgray">A new standard for fantasy tools.</h3>
                <p className="text-paragraph-lg text-pb_midgray">Playbook is a first-of-its-kind platform leveraging artificial intelligence to provide unprecedented insights and smart suggestions based on personalized data.</p>
              </div>
              {/* Tabs buttons */}
              <div className="mb-8 md:mb-0">
                <a
                  className={`flex items-center text-label-lg p-3 md:p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 1 ? 'bg-pb_paperwhite shadow-md border-pb_lightergray hover:shadow-lg' : 'bg-pb_blue text-pb_paperwhite shadow-lg border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(1); }}
                >
                  <div>
                    <div className="text-label-xl font-bold leading-snug tracking-tight mb-1">One Dashboard. Every Answer.</div>
                    <div className={`text-paragraph-lg ${tab === 1 ? 'text-pb_blue-50' : 'text-pb_mddarkgray'}`}>Everything you need to know about all your leagues, centralized in one clear view. See trends, expert consensus, and hidden opportunities to make league winning moves fast. </div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-pb_paperwhite rounded-full border border-pb_lightgray flex-shrink-0 ml-3">
                    <Compass className={`w-6 h-6 ${tab === 1 ? 'text-pb_darkgray' : 'text-pb_mddarkgray'}`} />
                  </div>
                </a>
                <a
                  className={`flex items-center text-label-lg p-3 md:p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 2 ? 'bg-pb_paperwhite shadow-md border-pb_lightergray hover:shadow-lg' : 'bg-pb_blue text-pb_paperwhite shadow-lg border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(2); }}
                >
                  <div>
                    <div className="text-label-xl font-bold leading-snug tracking-tight mb-1">Instant insights with personalized intelligence.</div>
                    <div className={`text-paragraph-lg ${tab === 2 ? 'text-pb_blue-50' : 'text-pb_mddarkgray'}`}>Turn hours of scattered research into seconds. Get key analytics and intelligent suggestions for trades, waivers, and matchups all tailored to your individual league and strategy.</div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-pb_paperwhite rounded-full border border-pb_lightgray flex-shrink-0 ml-3">
                    <BrainCog className={`w-6 h-6 ${tab === 2 ? 'text-pb_darkgray' : 'text-pb_mddarkgray'}`} />
                  </div>
                </a>
                <a
                  className={`flex items-center text-label-lg p-3 md:p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 3 ? 'bg-pb_paperwhite shadow-md border-pb_lightergray hover:shadow-lg' : 'bg-pb_blue text-pb_paperwhite shadow-lg border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(3); }}
                >
                  <div>
                    <div className="text-label-xl font-bold leading-snug tracking-tight mb-1">Find opportunities to exploit hidden value.</div>
                    <div className={`text-paragraph-lg ${tab === 3 ? 'text-pb_blue-50' : 'text-pb_mddarkgray'}`}>Playbook learns how you think, and instantly spots league winning moves by tracking opponent weakness&rsquo; and undervalued players using AI and your personalized data. </div>
                  </div>
                  <div className="flex justify-center items-center w-9 h-9 bg-pb_paperwhite rounded-full border border-pb_lightgray flex-shrink-0 ml-3">
                    <CandlestickChart className={`w-6 h-6 ${tab === 3 ? 'text-pb_darkgray' : 'text-pb_mddarkgray'}`} />
                  </div>
                </a>
              </div>
            </div>

            {/* Tabs items */}
            <div className="max-w-xl pt-5 md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 md:mb-0 md:order-1 overflow-hidden" ref={tabs}>
              <div className="relative flex flex-col text-center lg:text-right">
                {/* Item 1 */}
                <div className={`w-full transition-all duration-300 ${tab === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
                  <div className="relative inline-flex flex-col border-t-2 border-l-2 border-r-2 border-pb_lightergray rounded-xs " style={{
                    background: 'linear-gradient(to bottom, rgba(235, 235, 235, 0.2) 0%, rgba(235, 235, 235, 0.1) 50%, rgba(235, 235, 235, 0) 100%)',
                    borderImage: 'linear-gradient(to bottom, rgb(235, 235, 235) 0%, rgb(235, 235, 235) 50%, transparent 100%) 1'
                  }}>

                    <Image className="w-full rounded" src={FeaturesCard1} width={500} height="462" alt="Feature card 1" />
                    {/* <Image className="md:max-w-none absolute w-full left-0 transform animate-float" src={FeaturesElement} width={500} height="44" alt="Element" style={{ top: '30%' }} /> */}
                  </div>
                </div>
                {/* Item 2 */}
                <div className={`w-full transition-all duration-300 ${tab === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
                  <div className="relative inline-flex flex-col border-t-2 border-l-2 border-r-2 border-pb_lightergray rounded-xs " style={{
                    background: 'linear-gradient(to bottom, rgba(235, 235, 235, 0.2) 0%, rgba(235, 235, 235, 0.1) 50%, rgba(235, 235, 235, 0) 100%)',
                    borderImage: 'linear-gradient(to bottom, rgb(235, 235, 235) 0%, rgb(235, 235, 235) 50%, transparent 100%) 1'
                  }}>
                    <Image className="w-full rounded" src={FeaturesCard2} width={500} height="462" alt="Feature card 2" />
                    {/* <Image className="md:max-w-none absolute w-full left-0 transform animate-float" src={FeaturesElement} width={500} height="44" alt="Element" style={{ top: '30%' }} /> */}
                  </div>
                </div>
                {/* Item 3 */}
                <div className={`w-full transition-all duration-300 ${tab === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
                  <div className="relative inline-flex flex-col border-t-2 border-l-2 border-r-2 border-pb_lightergray rounded-xs " style={{
                    background: 'linear-gradient(to bottom, rgba(235, 235, 235, 0.2) 0%, rgba(235, 235, 235, 0.1) 50%, rgba(235, 235, 235, 0) 100%)',
                    borderImage: 'linear-gradient(to bottom, rgb(235, 235, 235) 0%, rgb(235, 235, 235) 50%, transparent 100%) 1'
                  }}>
                    <Image className="w-full rounded" src={FeaturesCard3} width={500} height="462" alt="Feature card 3" />
                    {/* <Image className="md:max-w-none absolute w-full left-0 transform animate-float" src={FeaturesElement} width={500} height="44" alt="Element" style={{ top: '30%' }} /> */}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}