import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Building, MapPin } from "lucide-react";
import paulPortrait from "@/assets/paul-portrait.jpg";

export const About = () => {
  const qualifications = [
    "Trained Psychologist",
    "Pastor with Special Anointing",
    "Team Leader at Inspired Teens Academy",
    "General Coordinating Manager",
    "Digital Creator"
  ];

  const education = [
    "Nasarawa State University",
    "Federal University of Technology, Minna (FUTMINNA)",
    "University of Jos (Unijos)",
    "Plateau State Polytechnic",
    "GSS RUBOCHI ABUJA"
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Meet <span className="text-primary">Mr. Paul Olayiwola</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            CEO & Founder of Mindscope Academy - Empowering People to Fulfill their Destinies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img 
                src={paulPortrait} 
                alt="Mr. Paul Olayiwola - CEO of Mindscope Academy" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg">
              <MapPin className="w-6 h-6 mb-1" />
              <div className="text-sm font-semibold">Based in Jos, Nigeria</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-primary" />
                Professional Background
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                A dedicated psychologist and spiritual leader with over 15 years of experience in 
                empowering young people to discover and pursue their life purposes. Mr. Paul combines 
                scientific psychology with spiritual insight to provide holistic career guidance.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {qualifications.map((qualification, index) => (
                  <Badge key={index} variant="secondary" className="text-sm p-2 justify-start">
                    {qualification}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Building className="w-6 h-6 mr-3 text-secondary" />
                Educational Journey
              </h3>
              <div className="space-y-3">
                {education.map((institution, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{institution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h4 className="text-xl font-bold text-foreground mb-2">Leadership</h4>
              <p className="text-muted-foreground">
                Leading teams and inspiring young minds to reach their full potential
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-8">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h4 className="text-xl font-bold text-foreground mb-2">Psychology</h4>
              <p className="text-muted-foreground">
                Professional psychological assessment and career guidance expertise
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-8">
              <Building className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="text-xl font-bold text-foreground mb-2">Empowerment</h4>
              <p className="text-muted-foreground">
                Spiritual anointing for helping people fulfill their destinies
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};