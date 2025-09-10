import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Building, MapPin, Award, BookOpen, Heart, Star, ArrowRight, Quote } from "lucide-react";
import paulPortrait from "@/assets/paul-portrait.jpg";

export const About = () => {
  const achievements = [
    {
      icon: Users,
      number: "500+",
      label: "Students Guided",
      description: "Young minds empowered to find their purpose"
    },
    {
      icon: Award,
      number: "15+",
      label: "Years Experience",
      description: "Dedicated to career guidance and psychology"
    },
    {
      icon: GraduationCap,
      number: "5",
      label: "Universities",
      description: "Educational journey across institutions"
    },
    {
      icon: Heart,
      number: "100%",
      label: "Passion Driven",
      description: "Committed to transforming lives"
    }
  ];

  const qualifications = [
    { title: "Trained Psychologist", category: "Professional" },
    { title: "Pastor with Special Anointing", category: "Spiritual" },
    { title: "Team Leader at Inspired Teens Academy", category: "Leadership" },
    { title: "General Coordinating Manager", category: "Management" },
    { title: "Digital Creator", category: "Innovation" }
  ];

  const education = [
    { institution: "Nasarawa State University", level: "University" },
    { institution: "Federal University of Technology, Minna (FUTMINNA)", level: "University" },
    { institution: "University of Jos (Unijos)", level: "University" },
    { institution: "Plateau State Polytechnic", level: "Polytechnic" },
    { institution: "GSS RUBOCHI ABUJA", level: "Secondary" }
  ];

  const testimonials = [
    {
      text: "Mr. Paul's guidance completely transformed my perspective on career choices. His blend of psychology and spiritual insight is remarkable.",
      author: "Former Student",
      role: "University Graduate"
    },
    {
      text: "The personalized approach and deep understanding of individual potential makes him an exceptional career counselor.",
      author: "Parent",
      role: "Grateful Parent"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
            ✨ Meet Our Founder
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Mr. Paul Olayiwola
            </span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            CEO & Founder of Mindscope Academy
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto italic">
            "Empowering People to Fulfill their Destinies"
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Profile Image Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                  <img 
                    src={paulPortrait} 
                    alt="Mr. Paul Olayiwola - CEO of Mindscope Academy" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">Based in Jos, Nigeria</div>
                          <div className="text-sm text-muted-foreground">Available for consultations</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Achievement Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-all duration-300 bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <achievement.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-foreground">{achievement.number}</div>
                        <div className="text-xs text-muted-foreground">{achievement.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="story" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="story">His Story</TabsTrigger>
                <TabsTrigger value="qualifications">Expertise</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="space-y-8">
                <Card className="shadow-elegant bg-gradient-to-br from-background to-muted/30">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Quote className="w-6 h-6 mr-3 text-primary" />
                      Mission & Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative p-6 bg-primary/5 rounded-2xl border border-primary/10">
                      <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/30" />
                      <p className="text-lg text-foreground italic pl-8">
                        "Every young person has a unique destiny waiting to unfold. My calling is to help them discover that purpose through the perfect blend of scientific psychology and spiritual guidance."
                      </p>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <p>
                        A dedicated psychologist and spiritual leader with over 15 years of experience in 
                        empowering young people to discover and pursue their life purposes. Mr. Paul combines 
                        evidence-based psychological assessment with deep spiritual insight to provide 
                        transformative career guidance.
                      </p>
                      <p>
                        His unique approach has helped hundreds of students not just find careers, but discover 
                        their true calling and develop the confidence to pursue their dreams with clarity and purpose.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-accent/5 border-accent/20">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                            <div className="text-xs">
                              <div className="font-semibold text-foreground">{testimonial.author}</div>
                              <div className="text-muted-foreground">{testimonial.role}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qualifications" className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Award className="w-6 h-6 mr-3 text-secondary" />
                      Professional Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {qualifications.map((qualification, index) => (
                        <div key={index} className="group p-4 rounded-xl bg-muted/30 hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {qualification.title}
                              </h4>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {qualification.category}
                              </Badge>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-accent" />
                      Educational Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {education.map((edu, index) => (
                        <div key={index} className="relative pl-8">
                          <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                          {index < education.length - 1 && (
                            <div className="absolute left-1.5 top-3 w-0.5 h-12 bg-primary/20"></div>
                          )}
                          <div className="bg-muted/30 rounded-xl p-4 hover:bg-primary/5 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">{edu.institution}</h4>
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {edu.level}
                                </Badge>
                              </div>
                              <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Call to Action */}
            <Card className="bg-gradient-primary text-white border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Future?</h3>
                <p className="text-white/90 mb-6 text-lg">
                  Experience personalized career guidance that combines psychology with purpose
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                    Book Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                    Learn More About Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};