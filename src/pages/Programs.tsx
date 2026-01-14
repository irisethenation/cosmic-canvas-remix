import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";
import CourseGrid from "@/components/CourseGrid";

const Programs = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Programs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive courses designed to develop your critical thinking skills 
              and epistemic sovereignty in the modern information landscape.
            </p>
          </div>
          <CourseGrid />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Programs;
