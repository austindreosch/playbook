'use client';

import Slide1 from '@/components/LandingPage/assets/1.jpg';
import Slide2 from '@/components/LandingPage/assets/2.jpg';
import Slide3 from '@/components/LandingPage/assets/3.jpg';
import BasketballHero from '@/components/LandingPage/assets/basketball-hero.png';
import JumbotronImage from '@/components/LandingPage/assets/jumbotron.png';
import { Button } from '@/components/alignui/button';
import { useDevUser } from '@/components/DevUserProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Hero() {
  const router = useRouter();
  const { user, isLoading } = useDevUser();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  
  const slides = [Slide1, Slide2, Slide3];
  const extendedSlides = [...slides, ...slides]; // Duplicate slides for infinite loop

  // Check screen size and trigger animation
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Force scroll to top on page load
    window.scrollTo(0, 0);
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600); // 600ms delay to let page load
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timer);
    };
  }, []);

  // Auto-advance carousel with infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        // When we reach the end of the duplicated slides, reset to slide 0 without animation
        if (next >= extendedSlides.length) {
          setTimeout(() => setCurrentSlide(0), 50); // Small delay to avoid visual glitch
          return prev; // Keep current position for this frame
        }
        return next;
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [extendedSlides.length]);

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





      <div className="max-w-8xl mx-auto lg:pr-8 relative z-20">
        {/* Hero content */}
        <div className="pt-20 pb-32 md:pt-32 md:pb-72">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">
            
            {/* Left side - Text content */}
            <div className="text-center px-4 md:px-0 pt-10 lg:text-left lg:pr-24 relative z-50">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-10 text-pb_darkgray" data-aos="zoom-y-out">
                Make league winning decisions <span className="bg-clip-text text-transparent bg-gradient-to-r from-pb_blue to-pb_green">faster.</span>
              </h1>
              <p className="text-[17px] text-pb_midgray mb-8 leading-relaxed" data-aos="zoom-y-out" data-aos-delay="150">
The all-in-one command center for fantasy sports strategy with <br/> AI integrated expert insights that learn your leagues and gameplan. Get ahead instantly & outclass your competition with a fraction of the effort.
              </p>
              {/* <p className="text-xl text-pb_midgray mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                Fantasy sports strategy made simple with AI-powered expert insights that learn your leagues and strategy. Outclass the competition with a fraction of the effort — all in one dashboard.
              </p> */}
              <div className="flex flex-col sm:flex-row gap-4  pt-4 items-center lg:items-start" data-aos="zoom-y-out" data-aos-delay="100">
                <Button
                  className="p-5 shadow-md font-bold bg-pb_blue text-white hover:bg-pb_bluehover border border-pb_blue w-48 sm:w-auto"
                  onClick={handleGetStarted}
                >
                  Join the Waitlist
                </Button>
                <a href="#features">
                  <Button variant="secondary" className="w-48 sm:w-auto p-5 shadow-md font-bold bg-pb_lightgray border border-pb_textlightergray text-pb_darkgray hover:bg-gray-300">
                    Learn More
                  </Button>
                </a>
              </div>
              
              <p className="text-sm text-pb_textgray mt-10 md:mt-6 text-center lg:text-left" data-aos="zoom-y-out" data-aos-delay="100">
                Playbook is in development. Sign up to get early access soon.
              </p>
            </div>

            {/* Right side - Jumbotron with carousel */}
            <div 
              className={`relative flex justify-center items-center mt-8 lg:ml-4 md:-mt-32 transition-all duration-1200 ease-out ${
                isDesktop 
                  ? isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-20'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Cables positioned relative to jumbotron */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* Mobile: Full height cables from nav to jumbotron */}
                <div className="lg:hidden">
                  {/* White gradient overlay - in same container as cables */}
                  <div 
                    className="absolute pointer-events-none z-20"
                    style={{ 
                      background: 'linear-gradient(to bottom, white 0%, white 65%, rgba(255,255,255,0.8) 75%, transparent 100%)',
                      top: '-100vh',
                      left: '-100vw',
                      right: '-100vw',
                      height: '120vh',
                      width: '300vw'
                    }}
                  />
                  {/* Left cable - mobile */}
                  <div 
                    className="absolute w-3.5 z-10"
                    style={{ 
                      left: 'calc(50% - 145px)', 
                      top: '-100vh', 
                      bottom: '75%',
                      background: 'linear-gradient(to right, #5a5a5a 0%, #5a5a5a 50%, #2d2d2d 50%, #2d2d2d 100%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                    }}
                  />
                  
                  {/* Middle cable - mobile */}
                  {/* <div 
                    className="absolute w-3.5 bg-pb_darkgray z-10"
                    style={{ 
                      left: 'calc(50% - 2px)', 
                      top: '-100vh', 
                      bottom: '75%',
                      boxShadow: 'inset -1px 0 0 #1f1f1f, inset 1px 0 0 #4a4a4a, 2px 0 4px rgba(0,0,0,0.3)'
                    }}
                  /> */}
                  
                  {/* Right cable - mobile */}
                  <div 
                    className="absolute w-3.5 z-10"
                    style={{ 
                      left: 'calc(50% + 130px)', 
                      top: '-100vh', 
                      bottom: '75%',
                      background: 'linear-gradient(to right, #5a5a5a 0%, #5a5a5a 50%, #2d2d2d 50%, #2d2d2d 100%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                    }}
                  />
                  

                </div>
                
                {/* Desktop: Original cables */}
                <div className="hidden lg:block">
                                                  {/* Left cable */}
                  <div 
                    className="absolute w-4"
                    data-aos="zoom-y-out" data-aos-delay="200"
                    style={{ 
                      left: 'calc(50% - 180px)', 
                      top: '-100px', 
                      bottom: '75%',
                      background: 'linear-gradient(to right, #5a5a5a 0%, #5a5a5a 50%, #2d2d2d 50%, #2d2d2d 100%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                    }}
                  />
                  
                  {/* Middle cable */}
                  <div 
                    className="absolute w-4"
                    data-aos="zoom-y-out" data-aos-delay="200"
                    style={{ 
                      left: 'calc(50% - 2px)', 
                      top: '-100px', 
                      bottom: '75%',
                      background: 'linear-gradient(to right, #5a5a5a 0%, #5a5a5a 50%, #2d2d2d 50%, #2d2d2d 100%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                    }}
                  />
                  
                  {/* Right cable */}
                  <div 
                       className="absolute w-4"
                       data-aos="zoom-y-out" data-aos-delay="200"
                    style={{ 
                      left: 'calc(50% + 176px)', 
                      top: '-100px', 
                      bottom: '75%',
                      background: 'linear-gradient(to right, #5a5a5a 0%, #5a5a5a 50%, #2d2d2d 50%, #2d2d2d 100%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>
              </div>
              
              {/* Jumbotron container */}
              <div className="relative w-full max-w-3xl scale-125 origin-center " >
                {/* Jumbotron image */}
                <img 
                  src={JumbotronImage.src || JumbotronImage} 
                  alt="Jumbotron display"
                  className="w-full h-auto relative z-10 select-none"
                  data-aos="zoom-y-out" data-aos-delay="100"
                  style={{
                    imageRendering: 'crisp-edges',
                    WebkitImageOptimization: 'high',
                    imageOptimization: 'high',
                    filter: 'contrast(1.05) saturate(1.05)',
                  }}
                  draggable={false}
                />
                
                {/* Carousel container - positioned inside the jumbotron screen */}
                <div className="absolute inset-0 flex items-center justify-center" data-aos="zoom-y-out" data-aos-delay="100">
                  {/* Adjust these percentages based on where the screen cutout is in your jumbotron image */}
                  <div className="absolute" style={{
                    top: '35%',
                    left: '12%',
                    right: '12%',
                    bottom: '15%',
                  }}>
                    {/* Carousel slides */}
                    <div className="relative w-full h-full overflow-hidden rounded-lg">
                      <div 
                        className="flex transition-transform duration-700 ease-in-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {extendedSlides.map((slide, index) => (
                          <div
                            key={index}
                            className="w-full h-full flex-shrink-0"
                          >
                            <img 
                              src={slide.src || slide} 
                              alt={`Dashboard view ${index + 1}`}
                              className="w-full h-full object-cover select-none"
                              style={{
                                imageRendering: 'crisp-edges',
                                WebkitImageOptimization: 'high',
                                imageOptimization: 'high',
                                filter: 'contrast(1.05) saturate(1.05)',
                              }}
                              draggable={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Carousel indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === (currentSlide % slides.length) ? 'bg-white' : 'bg-white/50'
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