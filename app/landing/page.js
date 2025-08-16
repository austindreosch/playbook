import DynamicNavbar from '@/components/Interface/DynamicNavbar'
import FeatureRoadmap from '@/components/LandingPage/feature-roadmap'
import Features from '@/components/LandingPage/features'
import FeaturesBlocks from '@/components/LandingPage/features-blocks'
import Footer from '@/components/LandingPage/footer'
import Hero from '@/components/LandingPage/hero'
import Newsletter from '@/components/LandingPage/newsletter'
import Testimonials from '@/components/LandingPage/testimonials'

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-3 2xl:px-0 py-2">
        <DynamicNavbar />
      </div>
      <Hero />
      <Features />
      <FeaturesBlocks />
      <FeatureRoadmap />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}

