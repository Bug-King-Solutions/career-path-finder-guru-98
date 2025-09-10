import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Smartphone, Brain, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import careerGuruMockup from "@/assets/career-guru-mockup.jpg";

export const Products = () => {
  const navigate = useNavigate();

  return (
    <section id="products" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Innovative solutions designed to help students discover their perfect career path and make informed decisions about their future.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Career Guru Product */}
          <div className="space-y-8">
            <Card className="border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Career Guru</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Psychology-based career guidance platform with comprehensive assessments and personalized university recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="text-sm">University Finder</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="text-sm">Psychology Tests</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <span className="text-sm">Mobile App Coming</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <span className="text-sm">Career Matching</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/career-guru')}
                    className="flex-1"
                  >
                    Explore Career Guru
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/psychology-test')}
                    className="flex-1"
                  >
                    Try Psychology Test
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Badge */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center space-x-3 mb-3">
                <Smartphone className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Mobile App Coming Soon</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Get ready for the ultimate career guidance experience on your mobile device. Sign up to be notified when it launches!
              </p>
              <Button variant="outline" size="sm">
                Notify Me
              </Button>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={careerGuruMockup} 
                alt="Career Guru Platform Preview" 
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-lg transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};