import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Workflow from '../components/landing/Workflow'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-slate-950">
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
