import { Separator } from '@/components/ui/separator'
import TestimonialImage from '@/public/austinprof.jpg'
import { Mail, MessageSquare, MessageSquareText } from 'lucide-react'
import Image from 'next/image'

export default function Testimonials() {
  return (
    <section className="bg-pb_white">
      <div className="max-w-6xl mx-auto py-16 px-8">
        <Separator className='bg-pb_lightgray h-[1px] mb-16' />
        <div className="md:grid md:grid-cols-5 md:gap-12 items-center">
          {/* Left column: headline + subhead */}
          <div className="space-y-4 md:col-span-3 text-center">
            <h2 className="text-3xl font-extrabold text-pb_darkgray">
              Get an early look at Playbook and <br /> help shape where it goes
            </h2>
            <p className="text-pb_midgray leading-relaxed max-w-prose mx-auto">
            This is your chance to try Playbook before everyone else. Get early access to next-gen fantasy tools and help influence the roadmap with your feedback. The vision is big and your voice can help shape what it becomes.

</p>
          </div>

          {/* Right column: Contact CTA */}
          <div className="flex justify-center md:justify-center mt-8 md:mt-0 md:col-span-2 text-center items-center">
            <div className="flex items-center gap-4">
              {/* <Image
                className="rounded-full"
                src={TestimonialImage}
                width={80}
                height={80}
                alt="Austin, Playbook founder"
              /> */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-pb_darkgray" />
                  <h3 className="md:text-lg font-semibold text-pb_darkgray">Have ideas, questions, or feedback?</h3>
                </div>
                <p className="text-pb_midgray text-sm pb-2 md:pb-0">
                  I&apos;d love to hear from you.
                </p>
                <a href="mailto:austin@playbookfantasy.com" className="block text-sm text-pb_darkgray py-1 font-medium hover:underline">austin@playbookfantasy.com</a>
                <a href="mailto:austin@playbookfantasy.com"
                  className="inline-flex items-center bg-pb_darkgray text-white font-medium px-4 py-2.5 rounded-lg shadow hover:bg-pb_darkgrayhover transition text-sm">
                  <Mail className="w-4 h-4 mr-2" />Send me a note
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}


