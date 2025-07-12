import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Brain, 
  MapPin, 
  GraduationCap, 
  Download,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import appMockup from "@/assets/career-guru-mockup.jpg";
import { WaitlistForm } from "./WaitlistForm";

export const CareerGuruApp = () => {
  const features = [
    {
      icon: Brain,
      title: "Psychology Tests",
      description: "Advanced psychological assessments to discover your strengths and interests"
    },
    {
      icon: GraduationCap,
      title: "Course Recommendations",
      description: "AI-powered suggestions for academic programs that match your profile"
    },
    {
      icon: MapPin,
      title: "University Finder",
      description: "Comprehensive database of Nigerian universities with detailed information"
    },
    {
      icon: Star,
      title: "Career Matching",
      description: "Match your personality and skills with suitable career paths"
    }
  ];

  const benefits = [
    "Scientifically validated psychology tests",
    "Personalized career recommendations",
    "Real-time university information",
    "Expert guidance from Mr. Paul Olayiwola",
    "Offline accessibility for rural areas",
    "Parent/guardian dashboard",
    "Progress tracking and reports",
    "24/7 career support chat"
  ];

  return (
    <section id="app" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
            <Smartphone className="w-5 h-5 mr-2" />
            Coming Soon
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">Career Guru</span> Mobile App
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The future of career guidance is in your pocket. Take psychology tests, discover your perfect career path, 
            and find the best universities - all from your mobile device.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-elegant">
              <img 
                src={appMockup} 
                alt="Career Guru App Interface" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
            </div>
            <div className="absolute -top-6 -left-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg animate-pulse-gentle">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Beta Users</div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-4 rounded-xl shadow-lg animate-pulse-gentle">
              <div className="text-2xl font-bold">4.9★</div>
              <div className="text-sm">Rating</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Revolutionary Career Guidance Technology
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Career Guru combines cutting-edge psychology with technology to provide 
                personalized career guidance. Built specifically for Nigerian students, 
                it understands local educational systems and career opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-bold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4" disabled>
                <Download className="mr-2 w-5 h-5" />
                Pre-register for Early Access
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Why Choose Career Guru?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Built by experts, designed for students. Career Guru isn't just another career app - 
                it's a comprehensive guidance system backed by years of psychological research and 
                real-world experience in Nigerian education.
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
                  <CardTitle className="text-white">Early Access Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-white/90">
                    <li>• Free lifetime premium features</li>
                    <li>• Direct access to Mr. Paul Olayiwola</li>
                    <li>• Priority university placement assistance</li>
                    <li>• Exclusive career webinars and workshops</li>
                  </ul>
                  <WaitlistForm>
                    <Button variant="accent" className="w-full mt-4">
                      Join Waiting List
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </WaitlistForm>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>App Launch Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div>
                        <div className="font-semibold">Q2 2024: Beta Testing</div>
                        <div className="text-sm text-muted-foreground">Limited release to select schools</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <div>
                        <div className="font-semibold">Q3 2024: Public Release</div>
                        <div className="text-sm text-muted-foreground">Available on Google Play & App Store</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};