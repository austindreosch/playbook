import TestimonialImage from '@/public/austinprof.jpg'
import Image from 'next/image'
import Link from 'next/link'

export default function Testimonials() {
  return (
    <section className="flex justify-center items-center py-12 md:py-20 bg-white">
      <div className="rounded-lg max-w-6xl w-full mx-4 px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center gap-12 ">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <h2 className="font-bold text-xl md:text-2xl mb-2 pb-2">
          Get an early look at Playbook and help shape where it goes
          </h2>
          <p className="text-gray-700 text-base mb-7">
          This is your chance to try Playbook before everyone else. Get early access to next-gen fantasy tools and help influence the roadmap with your feedback. The vision is big and your voice can help shape what it becomes.
          </p>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center text-gray-800 text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text-icon lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
              
              <span className='ml-2 font-bold'>Have ideas, questions, or feedback?</span>
            </div>
            <span className="text-gray-700 text-base mt-2">
              I&apos;d love to hear from you — {' '}
              <a
                href="mailto:austin@playbookfantasy.com"
                className="text-pb_blue break-all"
              >
                austin@playbookfantasy.com
              </a>
            </span>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <Image
            className="rounded-full border-4 border-white shadow-lg"
            src={TestimonialImage}
            width={140}
            height={140}
            alt="Austin, Playbook founder"
          />
        </div>
      </div>
    </section>
  )
}


