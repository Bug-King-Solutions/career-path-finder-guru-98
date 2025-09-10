import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/558ff49b-71c3-49e5-af31-23a7886a341a.png" 
              alt="Mindscope Academy Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Mindscope Academy</h1>
              <p className="text-xs text-muted-foreground">Career Guidance & Psychology</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#app" className="text-foreground hover:text-primary transition-colors">Career Guru</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="text-sm"
                >
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground">
                  {userRole && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mr-2">
                      {userRole}
                    </span>
                  )}
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-foreground hover:text-primary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="text-white bg-primary hover:bg-primary/90"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>


          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
              <a href="#app" className="text-foreground hover:text-primary transition-colors">Career Guru</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              
              {user ? (
                <div className="flex flex-col space-y-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="justify-start text-sm"
                  >
                    Dashboard
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {userRole && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mr-2">
                        {userRole}
                      </span>
                    )}
                    {user.email}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="justify-start text-foreground hover:text-primary"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="text-white bg-primary hover:bg-primary/90 mt-3"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};