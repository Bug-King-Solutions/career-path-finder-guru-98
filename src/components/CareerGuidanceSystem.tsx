import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  GraduationCap, 
  MapPin, 
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  BookOpen,
  Target
} from "lucide-react";
import { PsychologyTest } from "./PsychologyTest";
import { UniversityFinder } from "./UniversityFinder";
import { CareerMatcher } from "./CareerMatcher";

export const CareerGuidanceSystem = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      id: "psychology",
      icon: Brain,
      title: "Psychology Assessment",
      description: "Take scientifically-backed tests to discover your personality type and natural strengths",
      badge: "5 min test",
      color: "text-blue-600"
    },
    {
      id: "career",
      icon: Target,
      title: "Career Matching",
      description: "Get personalized career recommendations based on your profile and interests",
      badge: "AI-powered",
      color: "text-green-600"
    },
    {
      id: "university",
      icon: MapPin,
      title: "University Finder",
      description: "Find the perfect Nigerian universities that match your career goals and preferences",
      badge: "100+ universities",
      color: "text-purple-600"
    },
    {
      id: "guidance",
      icon: BookOpen,
      title: "Expert Guidance",
      description: "Access professional advice and resources from experienced career counselors",
      badge: "Coming Soon",
      color: "text-orange-600"
    }
  ];

  const benefits = [
    "Scientifically validated psychology assessments",
    "Comprehensive Nigerian university database",
    "AI-powered career matching algorithm",
    "Personalized recommendations and reports",
    "Expert guidance from Mr. Paul Olayiwola",
    "Real-time university information and requirements",
    "Career development resources and tools",
    "Progress tracking and detailed analytics"
  ];

  const stats = [
    { number: "2,000+", label: "Students Guided" },
    { number: "150+", label: "Universities Listed" },
    { number: "50+", label: "Career Paths" },
    { number: "98%", label: "Success Rate" }
  ];

  return (
    <section id="career-system" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
            <Star className="w-5 h-5 mr-2" />
            Now Available
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">Career Guidance</span> Web Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover your perfect career path with our comprehensive web-based guidance system. 
            Take psychology tests, explore careers, and find the best universities - all in one place.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="psychology">Psychology Test</TabsTrigger>
              <TabsTrigger value="career">Career Match</TabsTrigger>
              <TabsTrigger value="university">Universities</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-12">
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center shadow-card">
                  <CardContent className="pt-6">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveTab(feature.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-muted ${feature.color}`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {feature.badge}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Why Use Our Career Guidance System?
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    Our platform combines scientific psychology assessments with comprehensive 
                    career data to provide personalized guidance tailored specifically for 
                    Nigerian students and the local job market.
                  </p>
                  
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-primary text-white border-0">
                    <CardHeader>
                      <CardTitle className="text-white">Get Started Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/90 mb-4">
                        Begin your career discovery journey with our comprehensive assessment tools.
                      </p>
                      <div className="space-y-3">
                        <Button 
                          variant="accent" 
                          className="w-full"
                          onClick={() => setActiveTab("psychology")}
                        >
                          <Brain className="mr-2 w-4 h-4" />
                          Start Psychology Test
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => setActiveTab("career")}
                        >
                          <Target className="mr-2 w-4 h-4" />
                          Find Career Match
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Process Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <div className="font-semibold">Take Assessment</div>
                            <div className="text-sm text-muted-foreground">Complete psychology and skills tests</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <div className="font-semibold">Get Matches</div>
                            <div className="text-sm text-muted-foreground">Receive personalized career recommendations</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <div className="font-semibold">Find Universities</div>
                            <div className="text-sm text-muted-foreground">Explore relevant academic programs</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="psychology">
            <PsychologyTest />
          </TabsContent>

          <TabsContent value="career">
            <CareerMatcher />
          </TabsContent>

          <TabsContent value="university">
            <UniversityFinder />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};