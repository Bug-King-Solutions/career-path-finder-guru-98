import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    id: 1,
    title: "Career Guidance Workshop - University of Jos",
    description: "Successfully guided 200+ students in career path selection",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023"
  },
  {
    id: 2,
    title: "Psychology Assessment Program",
    description: "Comprehensive psychological testing for 150+ teenagers",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023"
  },
  {
    id: 3,
    title: "Mindscope Empowerment Summit",
    description: "Annual summit reaching 500+ young people across Plateau State",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2022"
  },
  {
    id: 4,
    title: "School Career Days",
    description: "Visited 20+ secondary schools providing career guidance",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2022"
  },
  {
    id: 5,
    title: "Online Career Webinar Series",
    description: "Monthly webinars with 300+ participants nationwide",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023"
  },
  {
    id: 6,
    title: "Parent-Student Career Sessions",
    description: "Family-focused career guidance sessions",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023"
  }
];

export const Gallery = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Over the years, Mindscope Academy has successfully guided thousands of students 
            in their career journey. Here are some of our impactful projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-background">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {project.year}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-primary/10 px-6 py-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2000+</div>
              <div className="text-sm text-muted-foreground">Students Guided</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Schools Visited</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};