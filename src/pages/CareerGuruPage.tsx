import { useState } from "react";
import { CareerGuruHeader } from "@/components/CareerGuruHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, Users, Lightbulb, ArrowRight, Star, CheckCircle, BookOpen, MapPin, GraduationCap } from "lucide-react";
import { UniversityFinder } from "@/components/UniversityFinder";
import { CareerMatcher } from "@/components/CareerMatcher";
import { useNavigate, Link } from "react-router-dom";

const CareerGuruPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      id: "psychology",
      icon: Brain,
      title: "Psychology Assessment",
      description: "Take scientifically-backed tests to discover your personality type and natural strengths",
      badge: "5 min test",
      color: "text-primary"
    },
    {
      id: "career",
      icon: Target,
      title: "Career Matching",
      description: "Get personalized career recommendations based on your profile and interests",
      badge: "AI-powered",
      color: "text-secondary"
    },
    {
      id: "university",
      icon: MapPin,
      title: "University Finder",
      description: "Find the perfect Nigerian universities that match your career goals and preferences",
      badge: "100+ universities",
      color: "text-primary"
    },
    {
      id: "guidance",
      icon: BookOpen,
      title: "Expert Guidance",
      description: "Access professional advice and resources from experienced career counselors",
      badge: "Coming Soon",
      color: "text-secondary"
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
    <div className="min-h-screen bg-background">
      <CareerGuruHeader />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="animate-fade-in">
              <Badge className="mb-8 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                🚀 AI-Powered Career Discovery
              </Badge>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Career Guru
              </h1>
              <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
                Discover your <span className="text-accent-light font-semibold">perfect career path</span> with advanced psychology assessments, 
                AI-powered recommendations, and personalized university guidance.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-3xl md:text-4xl font-bold text-accent-light mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90 text-xl px-10 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/psychology-test')}
                  variant="outline" 
                  className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary text-xl px-10 py-4 h-auto font-semibold backdrop-blur-sm"
                >
                  <Brain className="w-6 h-6 mr-3" />
                  Try Psychology Test
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Career Guidance System */}
      <section className="py-20 bg-muted/30">
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
              <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full max-w-2xl">
                <TabsTrigger value="overview">Overview</TabsTrigger>
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
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      {feature.id === 'psychology' ? (
                        <Link to="/psychology-test">
                          <Button className="w-full">Take Test</Button>
                        </Link>
                      ) : (
                        <Button 
                          onClick={() => setActiveTab(feature.id)} 
                          className="w-full"
                          disabled={feature.id === 'guidance'}
                        >
                          {feature.id === 'guidance' ? 'Coming Soon' : 'Explore'}
                        </Button>
                      )}
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
                          <Link to="/psychology-test">
                            <Button 
                              variant="secondary" 
                              className="w-full bg-white text-primary hover:bg-white/90"
                            >
                              <Brain className="mr-2 w-4 h-4" />
                              Start Psychology Test
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="w-full border-white text-white hover:bg-white hover:text-primary"
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
                            <div className="w-8 h-8 bg-tertiary text-tertiary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
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

            <TabsContent value="career">
              <CareerMatcher />
            </TabsContent>

            <TabsContent value="university">
              <UniversityFinder />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              See how Career Guru has transformed students' career journeys
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Career Guru helped me discover my passion for data science. 
                  The personality test was spot-on and the university recommendations were perfect!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-primary">AM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Amara Mohammed</p>
                    <p className="text-xs text-muted-foreground">Computer Science Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I was confused about my career path until I used Career Guru. 
                  Now I'm confidently pursuing engineering with a clear roadmap."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-secondary">JO</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">John Okafor</p>
                    <p className="text-xs text-muted-foreground">Engineering Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The assessment revealed my strengths in creative problem-solving. 
                  Career Guru guided me to the perfect architecture program!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-primary">FA</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fatima Abdullahi</p>
                    <p className="text-xs text-muted-foreground">Architecture Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Discover Your Perfect Career?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of students who have found their ideal career path with Career Guru. 
              Start your journey today - it's free to begin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center justify-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerGuruPage;