import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface University {
  id: string;
  school_name: string;
  school_type: string;
  location: string;
}

interface Props {
  selectedCareers: string[];
  onExploreUniversity: (universityId: string) => void;
}

export const UniversityRecommendations = ({ selectedCareers, onExploreUniversity }: Props) => {
  const { user } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [exploredUniversities, setExploredUniversities] = useState<string[]>([]);

  useEffect(() => {
    fetchUniversities();
    fetchExploredUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('school_options')
        .select('*')
        .eq('school_type', 'University')
        .order('school_name');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const fetchExploredUniversities = async () => {
    if (!user) return;

    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (studentData) {
        const { data: progressData } = await supabase
          .from('student_progress')
          .select('universities_explored')
          .eq('student_id', studentData.id);

        if (progressData) {
          const allExplored = progressData.flatMap(p => p.universities_explored || []);
          setExploredUniversities([...new Set(allExplored)]);
        }
      }
    } catch (error) {
      console.error('Error fetching explored universities:', error);
    }
  };

  const handleExploreUniversity = async (university: University) => {
    if (!user || !selectedCareers.length) return;

    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (studentData) {
        // Update progress for the selected career field
        const primaryCareer = selectedCareers[0];
        
        const { data: existingProgress } = await supabase
          .from('student_progress')
          .select('*')
          .eq('student_id', studentData.id)
          .eq('course_field', primaryCareer)
          .single();

        const currentExplored = existingProgress?.universities_explored || [];
        const updatedExplored = [...new Set([...currentExplored, university.id])];

        if (existingProgress) {
          await supabase
            .from('student_progress')
            .update({
              universities_explored: updatedExplored,
              progress_percentage: Math.min(100, existingProgress.progress_percentage + 10)
            })
            .eq('id', existingProgress.id);
        } else {
          await supabase
            .from('student_progress')
            .insert({
              student_id: studentData.id,
              course_field: primaryCareer,
              universities_explored: [university.id],
              progress_percentage: 10
            });
        }

        setExploredUniversities(prev => [...new Set([...prev, university.id])]);
        onExploreUniversity(university.id);
        toast.success(`Added ${university.school_name} to your explored universities!`);
      }
    } catch (error) {
      console.error('Error updating university exploration:', error);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading universities...</p>
      </div>
    );
  }

  if (!selectedCareers.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Complete a career assessment to see university recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Recommended Universities</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your interest in: {selectedCareers.join(', ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {universities.map((university) => {
          const isExplored = exploredUniversities.includes(university.id);
          
          return (
            <Card key={university.id} className={`transition-all hover:shadow-lg ${isExplored ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{university.school_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{university.school_type}</Badge>
                      {isExplored && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1" />
                          Explored
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {university.location}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Programs Available:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCareers.map((career, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleExploreUniversity(university)}
                  variant={isExplored ? "outline" : "default"}
                  className="w-full"
                  disabled={isExplored}
                >
                  {isExplored ? (
                    "Already Explored"
                  ) : (
                    <>
                      Explore University
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {universities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No universities found. Please contact an administrator to add university options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};