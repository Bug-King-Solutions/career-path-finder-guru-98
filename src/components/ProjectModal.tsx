import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  year: string;
  fullDescription?: string;
  participants?: string;
  location?: string;
  outcomes?: string[];
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{project.year}</span>
            </div>
            {project.participants && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{project.participants}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {project.fullDescription || project.description}
            </p>

            {project.outcomes && project.outcomes.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3">Key Outcomes:</h4>
                <div className="space-y-2">
                  {project.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span className="text-muted-foreground">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};