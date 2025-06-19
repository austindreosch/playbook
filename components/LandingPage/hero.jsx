'use client';

import ModalVideo from '@/components/LandingPage/internal/modal-video';
import { Button } from '@/components/ui/button';
import VideoThumb from '@/public/images/hero-image.png';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import ModalImage from './internal/modal-image';

export default function Hero() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleGetStarted = () => {
    if (isLoading) return; // Prevent action while loading

    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <section className="relative overflow-hidden">

      {/* Illustration behind hero content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero content */}
        <div className="pt-24 pb-12 md:pt-32 md:pb-20">

          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 text-pb_darkgray" data-aos="zoom-y-out">Make league winning decisions <span className="bg-clip-text text-transparent bg-gradient-to-r from-pb_blue to-pb_green">faster.</span></h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-pb_midgray mb-8" data-aos="zoom-y-out" data-aos-delay="150">Fantasy sports strategy made simple with AI-powered expert insights that learn your leagues and strategy. Outclass the competition with a fraction of the effort — all in one dashboard.</p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div>
                  <Button
                    className="w-full p-5 shadow-md font-bold bg-pb_blue text-white hover:bg-pb_bluehover mb-4 sm:w-auto sm:mb-0"
                    onClick={handleGetStarted}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </Button>
                </div>
                <div>
                  <a href="#features">
                    <Button variant="secondary" className="w-full p-5 shadow-md font-bold bg-pb_lightergray text-pb_darkgray hover:bg-gray-300 sm:w-auto sm:ml-4">
                      Learn more
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image - Need to make a video first. */}
          {/* <ModalVideo
            thumb={VideoThumb}
            thumbWidth={768}
            thumbHeight={432}
            thumbAlt="Modal video thumbnail"
            video="/videos/video.mp4"
            videoWidth={1920}
            videoHeight={1080} /> */}

            <ModalImage
              thumb={VideoThumb}
              thumbWidth={1920}
              thumbHeight={1080}
              thumbAlt="Modal video thumbnail"
              fullImage={VideoThumb}
              fullImageWidth={1920}
              fullImageHeight={1080}
              className="border-2 border-gray-300 shadow-md"
            />

        </div>

      </div>
    </section>
  )
}