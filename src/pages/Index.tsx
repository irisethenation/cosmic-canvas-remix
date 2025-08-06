import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CourseGrid from "@/components/CourseGrid";
import ProgramDetailsSection from "@/components/ProgramDetailsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CourseGrid />
      <ProgramDetailsSection />
      <Footer />
    </div>
  );
};

export default Index;
