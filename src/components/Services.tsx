
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  UserCheck, 
  BookOpen, 
  Users, 
  Target, 
  Compass,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { BookingForm } from "./BookingForm";

export const Services = () => {
  const handleLearnMore = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Brain,
      title: "Psychology Assessment",
      description: "Comprehensive psychological testing to understand your personality, interests, and cognitive abilities.",
      features: [
        "Personality assessments",
        "Interest inventories", 
        "Cognitive ability tests",
        "Career aptitude analysis"
      ],
      color: "text-primary"
    },
    {
      icon: UserCheck,
      title: "One-on-One Consultation",
      description: "Personal career guidance sessions with Mr. Paul Olayiwola to explore your unique path.",
      features: [
        "Individual counseling sessions",
        "Personalized career roadmaps",
        "Goal setting and planning",
        "Ongoing mentorship"
      ],
      color: "text-secondary"
    },
    {
      icon: BookOpen,
      title: "Course Selection Guidance",
      description: "Expert advice on choosing the right academic programs based on your test results.",
      features: [
        "University program matching",
        "Course requirement analysis",
        "Academic pathway planning",
        "Scholarship opportunities"
      ],
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Group Workshops",
      description: "Interactive sessions for schools and groups focusing on career awareness and planning.",
      features: [
        "School career workshops",
        "Parent information sessions",
        "Peer group activities",
        "Skills development programs"
      ],
      color: "text-primary"
    },
    {
      icon: Target,
      title: "University Matching",
      description: "Find the best universities in Nigeria that align with your career goals and academic profile.",
      features: [
        "University database access",
        "Admission requirements",
        "Location preferences",
        "Program quality rankings"
      ],
      color: "text-secondary"
    },
    {
      icon: Compass,
      title: "Life Purpose Discovery",
      description: "Spiritual and psychological guidance to help you understand your true calling and purpose.",
      features: [
        "Purpose identification sessions",
        "Spiritual counseling",
        "Life vision development",
        "Destiny mapping"
      ],
      color: "text-accent"
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive career guidance services designed to help you make informed decisions about your future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-elegant transition-all duration-300 group hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={handleLearnMore}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Career Journey?
            </h3>
            <p className="text-xl mb-8 text-white/90">
              Book a consultation with Mr. Paul Olayiwola today and take the first step towards your dream career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingForm>
                <Button variant="accent" size="lg" className="text-lg px-8 py-4">
                  Book Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </BookingForm>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                Download Career Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
