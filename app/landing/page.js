import Features from '@/components/LandingPage/features'
import FeaturesBlocks from '@/components/LandingPage/features-blocks'
import Footer from '@/components/LandingPage/footer'
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
      <Footer />
    </>
  )
}

