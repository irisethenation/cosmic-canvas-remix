import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CourseGrid from "@/components/CourseGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProgramDetailsSection from "@/components/ProgramDetailsSection";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import TelegramChatWidget from "@/components/TelegramChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <CourseGrid />
        <TestimonialsSection />
        <ProgramDetailsSection />
        <Footer />
      </div>
      <TelegramChatWidget />
    </div>
  );
};

export default Index;
