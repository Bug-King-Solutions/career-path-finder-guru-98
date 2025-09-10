import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CareerGuruHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-background/95 backdrop-blur-sm shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/558ff49b-71c3-49e5-af31-23a7886a341a.png" 
              alt="Career Guru Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Career Guru</h1>
              <p className="text-xs text-muted-foreground">by Mindscope Academy</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </header>
  );
};