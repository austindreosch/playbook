'use client';

import Slide1 from '@/components/LandingPage/assets/1.jpg';
import Slide2 from '@/components/LandingPage/assets/2.jpg';
import Slide3 from '@/components/LandingPage/assets/3.jpg';
import BasketballHero from '@/components/LandingPage/assets/basketball-hero.png';
import JumbotronImage from '@/components/LandingPage/assets/jumbotron.png';
import { Button } from '@/components/ui/button';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Hero() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [Slide1, Slide2, Slide3];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleGetStarted = () => {
    if (isLoading) return;

    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Basketball hero background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 -z-10" 
        style={{ backgroundImage: `url(${BasketballHero.src || BasketballHero})` }}
        aria-hidden="true"
      />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:pl-8 lg:pr-6">
        {/* Hero content */}
        <div className="pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">
            
            {/* Left side - Text content */}
            <div className="text-left lg:pr-32">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-6 text-pb_darkgray" data-aos="zoom-y-out">
                Make league winning decisions <span className="bg-clip-text text-transparent bg-gradient-to-r from-pb_blue to-pb_green">faster.</span>
              </h1>
              <p className="text-xl text-pb_midgray mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                Fantasy sports strategy made simple with AI-powered expert insights that learn your leagues and strategy. Outclass the competition with a fraction of the effort — all in one dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4" data-aos="zoom-y-out" data-aos-delay="300">
                <Button
                  className="p-5 shadow-md font-bold bg-pb_blue text-white hover:bg-pb_bluehover"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </Button>
                <a href="#features">
                  <Button variant="secondary" className="w-full sm:w-auto p-5 shadow-md font-bold bg-pb_lightergray text-pb_darkgray hover:bg-gray-300">
                    Learn more
                  </Button>
                </a>
              </div>
            </div>

            {/* Right side - Jumbotron with carousel */}
            <div className="relative flex justify-center items-center -mt-20 md:-mt-32" data-aos="fade-left" data-aos-delay="400">
              {/* Jumbotron container */}
              <div className="relative w-full max-w-3xl scale-125 origin-center">
                {/* Jumbotron image */}
                <img 
                  src={JumbotronImage.src || JumbotronImage} 
                  alt="Jumbotron display"
                  className="w-full h-auto relative z-10"
                />
                
                {/* Carousel container - positioned inside the jumbotron screen */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Adjust these percentages based on where the screen cutout is in your jumbotron image */}
                  <div className="absolute" style={{
                    top: '35%',
                    left: '12%',
                    right: '12%',
                    bottom: '15%',
                  }}>
                    {/* Carousel slides */}
                    <div className="relative w-full h-full overflow-hidden rounded-lg">
                      {slides.map((slide, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <img 
                            src={slide.src || slide} 
                            alt={`Dashboard view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Carousel indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-white' : 'bg-white/50'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}