import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectModal } from "./ProjectModal";

const projects = [
  {
    id: 1,
    title: "Career Guidance Workshop - University of Jos",
    description: "Successfully guided 200+ students in career path selection",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023",
    fullDescription: "A comprehensive 3-day career guidance workshop conducted at the University of Jos in partnership with the Student Affairs Department. The workshop focused on helping students understand their strengths, interests, and career opportunities in their chosen fields.",
    participants: "200+ university students",
    location: "University of Jos, Plateau State",
    outcomes: [
      "95% of participants reported increased clarity about their career paths",
      "120 students signed up for follow-up individual consultations",
      "Partnership established with university for annual career programs",
      "Created mentorship network connecting students with industry professionals"
    ]
  },
  {
    id: 2,
    title: "Psychology Assessment Program",
    description: "Comprehensive psychological testing for 150+ teenagers",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023",
    fullDescription: "An intensive psychological assessment program designed to help teenagers understand their personality types, learning styles, and career aptitudes. The program included standardized psychological tests, one-on-one consultations, and personalized career recommendations.",
    participants: "150+ teenagers (ages 14-19)",
    location: "Mindscope Academy, Jos",
    outcomes: [
      "Identified optimal learning strategies for each participant",
      "Provided detailed career compatibility reports",
      "85% of participants chose courses aligned with their assessments",
      "Established long-term tracking system for career progression"
    ]
  },
  {
    id: 3,
    title: "Mindscope Empowerment Summit",
    description: "Annual summit reaching 500+ young people across Plateau State",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2022"
  },
  {
    id: 4,
    title: "School Career Days",
    description: "Visited 20+ secondary schools providing career guidance",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2022"
  },
  {
    id: 5,
    title: "Online Career Webinar Series",
    description: "Monthly webinars with 300+ participants nationwide",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023"
  },
  {
    id: 6,
    title: "Parent-Student Career Sessions",
    description: "Family-focused career guidance sessions",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    year: "2023"
  }
];

export const Gallery = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

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
            <Card 
              key={project.id} 
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-background cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
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

        <ProjectModal 
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </section>
  );
};