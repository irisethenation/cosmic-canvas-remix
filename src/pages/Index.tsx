import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CourseGrid from "@/components/CourseGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProgramDetailsSection from "@/components/ProgramDetailsSection";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <CourseGrid />
        <TestimonialsSection />
        <ProgramDetailsSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
