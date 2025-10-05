import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { BookingForm } from "./BookingForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState({
    title: "Discover Your Perfect Career Path",
    subtitle: "Expert Career Guidance",
    description: "Expert psychology-based career guidance, comprehensive assessments, and personalized university recommendations for Nigerian students.",
    image_url: heroImage
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'hero')
        .single();
      
      if (data) {
        setHeroData({
          title: data.title || heroData.title,
          subtitle: data.subtitle || heroData.subtitle,
          description: data.description || heroData.description,
          image_url: data.image_url || heroImage
        });
      }
    };
    
    fetchHeroData();
  }, []);

  return (
    <section id="home" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroData.image_url} 
          alt="Career guidance consultation" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {heroData.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              {heroData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/career-guru')}
              >
                Explore Career Guru
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/psychology-test')}
              >
                Try Psychology Test
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Users className="w-8 h-8 mx-auto mb-2 text-accent-light" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/80">Students Guided</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-accent-light" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-white/80">Universities Listed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Award className="w-8 h-8 mx-auto mb-2 text-accent-light" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
          
          <div className="lg:ml-12 animate-slide-up">
            {/* This space could be used for additional graphics or forms */}
          </div>
        </div>
      </div>
    </section>
  );
};