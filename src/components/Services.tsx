
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = {
  Brain, UserCheck, BookOpen, Users, Target, Compass
};

export const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('order_position');
      
      if (data) {
        setServices(data);
      }
    };
    
    fetchServices();
  }, []);

  const handleLearnMore = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Target;
            const colors = ['text-primary', 'text-secondary', 'text-accent'];
            const color = colors[index % 3];
            
            return (
              <Card 
                key={service.id} 
                className="shadow-card hover:shadow-elegant transition-all duration-300 group hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
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
            );
          })}
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
