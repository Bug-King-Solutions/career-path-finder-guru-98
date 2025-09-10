import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Smartphone, Brain, GraduationCap, Zap, Users, Target, Star, Sparkles, Play, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WaitlistForm } from "@/components/WaitlistForm";
import careerGuruMockup from "@/assets/career-guru-mockup.jpg";

export const Products = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const products = [
    {
      id: "career-guru-web",
      title: "Career Guru",
      subtitle: "Web Platform",
      description: "Comprehensive career guidance system with psychology-based assessments and AI-powered recommendations.",
      status: "Available Now",
      statusColor: "bg-green-500",
      image: careerGuruMockup,
      features: [
        { icon: Brain, text: "Psychology Tests" },
        { icon: Target, text: "Career Matching" },
        { icon: GraduationCap, text: "University Finder" },
        { icon: Users, text: "Expert Guidance" }
      ],
      stats: [
        { label: "Success Rate", value: "98%" },
        { label: "Universities", value: "50+" },
        { label: "Students", value: "500+" }
      ],
      primaryAction: {
        text: "Explore Career Guru",
        action: () => navigate('/career-guru')
      },
      secondaryAction: {
        text: "Try Psychology Test",
        action: () => navigate('/psychology-test')
      }
    },
    {
      id: "career-guru-mobile",
      title: "Career Guru",
      subtitle: "Mobile App",
      description: "Take your career guidance journey anywhere with our upcoming native mobile application.",
      status: "Coming Soon",
      statusColor: "bg-orange-500",
      image: "/lovable-uploads/558ff49b-71c3-49e5-af31-23a7886a341a.png",
      features: [
        { icon: Smartphone, text: "Native Experience" },
        { icon: Zap, text: "Offline Access" },
        { icon: Calendar, text: "Smart Reminders" },
        { icon: Star, text: "Premium Features" }
      ],
      stats: [
        { label: "Launch", value: "Q2 2025" },
        { label: "Pre-orders", value: "1K+" },
        { label: "Features", value: "25+" }
      ],
      timeline: [
        { phase: "Beta Testing", status: "active", date: "Jan 2025" },
        { phase: "App Store Review", status: "pending", date: "Feb 2025" },
        { phase: "Public Launch", status: "pending", date: "Mar 2025" }
      ]
    }
  ];

  return (
    <section id="products" className="py-32 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-6 py-3 rounded-full mb-8">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Our Product Ecosystem</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8">
            Transforming
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"> Career </span>
            Discovery
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            From comprehensive web-based assessments to mobile convenience, 
            our innovative solutions guide students through every step of their career journey.
          </p>
        </div>

        {/* Products Grid */}
        <div className="space-y-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group relative ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Card className="overflow-hidden border-0 shadow-2xl bg-background/80 backdrop-blur-sm">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 0 ? '' : 'lg:grid-cols-2'}`}>
                  {/* Content Side */}
                  <div className={`p-12 flex flex-col justify-center ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="space-y-8">
                      {/* Header */}
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${product.statusColor} animate-pulse`}></div>
                          <Badge variant="outline" className="text-sm">
                            {product.status}
                          </Badge>
                        </div>
                        <h3 className="text-4xl font-bold text-foreground mb-2">
                          {product.title}
                        </h3>
                        <p className="text-xl text-primary font-medium mb-4">
                          {product.subtitle}
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-4">
                        {product.features.map((feature, featureIndex) => (
                          <div 
                            key={featureIndex} 
                            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/5 transition-all duration-300"
                          >
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <feature.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{feature.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                        {product.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Timeline for Mobile App */}
                      {product.id === 'career-guru-mobile' && product.timeline && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-foreground flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-primary" />
                            Development Timeline
                          </h4>
                          <div className="space-y-3">
                            {product.timeline.map((phase, phaseIndex) => (
                              <div key={phaseIndex} className="flex items-center space-x-4">
                                <div className={`w-3 h-3 rounded-full ${
                                  phase.status === 'active' ? 'bg-primary animate-pulse' : 
                                  phase.status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground/30'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">{phase.phase}</span>
                                    <span className="text-sm text-muted-foreground">{phase.date}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {product.id === 'career-guru-web' ? (
                          <>
                            <Button 
                              size="lg" 
                              onClick={product.primaryAction.action}
                              className="flex-1 text-lg py-6 group/btn"
                            >
                              {product.primaryAction.text}
                              <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="lg"
                              onClick={product.secondaryAction?.action}
                              className="flex-1 text-lg py-6"
                            >
                              <Brain className="mr-2 w-5 h-5" />
                              {product.secondaryAction?.text}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <WaitlistForm>
                              <Button size="lg" className="w-full text-lg py-6 group/btn">
                                <Star className="mr-2 w-5 h-5" />
                                Join Waitlist for Early Access
                                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </WaitlistForm>
                            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                <span>Free premium for 3 months</span>
                              </div>
                              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-primary" />
                                <span>Priority support</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className={`relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    <div className="relative p-12 flex items-center justify-center min-h-[500px]">
                      <div className={`relative transform transition-all duration-700 ${
                        hoveredProduct === product.id ? 'scale-105 rotate-2' : 'scale-100 rotate-0'
                      }`}>
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={`${product.title} ${product.subtitle}`}
                            className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                          />
                          
                          {/* Floating Elements */}
                          <div className={`absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-xl transition-all duration-500 ${
                            hoveredProduct === product.id ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${product.statusColor} animate-pulse`}></div>
                              <span className="text-sm font-medium text-foreground">{product.status}</span>
                            </div>
                          </div>

                          {product.id === 'career-guru-web' && (
                            <div className={`absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-xl transition-all duration-500 delay-200 ${
                              hoveredProduct === product.id ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                            }`}>
                              <div className="flex items-center space-x-2">
                                <Play className="w-4 h-4" />
                                <span className="text-sm font-medium">Try Demo</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <Card className="bg-gradient-primary text-white border-0 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Future?</h3>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of students who have discovered their perfect career path
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate('/career-guru')}
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/psychology-test')}
                  className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                >
                  Try Free Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};