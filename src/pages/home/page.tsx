import Navbar from '../../components/feature/Navbar';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SystemSection from './components/SystemSection';
import HowItWorksSection from './components/HowItWorksSection';
import DroughtCategoriesSection from './components/DroughtCategoriesSection';
import ScopeSection from './components/ScopeSection';
import CTASection from './components/CTASection';
import Footer from '../../components/feature/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-body">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SystemSection />
        <HowItWorksSection />
        <DroughtCategoriesSection />
        <ScopeSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
