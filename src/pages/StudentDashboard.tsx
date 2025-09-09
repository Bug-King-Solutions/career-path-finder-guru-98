import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, Users, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PsychologyTest } from '@/components/PsychologyTest';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Fetch student profile
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (studentData) {
        setStudent(studentData);

        // Fetch test results
        const { data: resultsData } = await supabase
          .from('student_test_results')
          .select('*')
          .eq('student_id', studentData.id)
          .order('completed_at', { ascending: false });

        if (resultsData) {
          setTestResults(resultsData);
        }

        // Fetch progress
        const { data: progressData } = await supabase
          .from('student_progress')
          .select('*')
          .eq('student_id', studentData.id);

        if (progressData) {
          setProgress(progressData);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showTest) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setShowTest(false)}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          <PsychologyTest />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {student?.first_name} {student?.last_name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your personality assessments and career exploration progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testResults.length}</div>
              <p className="text-xs text-muted-foreground">
                {testResults.length === 0 ? 'Take your first test!' : 'Keep exploring yourself'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.length > 0 ? Math.round(progress.reduce((acc, p) => acc + p.progress_percentage, 0) / progress.length) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall exploration progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fields Explored</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.length}</div>
              <p className="text-xs text-muted-foreground">
                Different career fields
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.reduce((acc, p) => acc + (p.universities_explored?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Universities explored
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Latest Result:</span>
                    <Badge variant="secondary">{testResults[0].personality_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completed on {new Date(testResults[0].completed_at).toLocaleDateString()}
                  </p>
                  <Button onClick={() => setShowTest(true)} variant="outline" className="w-full">
                    Take Test Again
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Take your first personality assessment to discover career paths that match your interests and skills.
                  </p>
                  <Button onClick={() => setShowTest(true)} className="w-full">
                    Start Personality Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Exploration Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progress.length > 0 ? (
                progress.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.course_field}</span>
                      <span className="text-sm text-muted-foreground">{item.progress_percentage}%</span>
                    </div>
                    <Progress value={item.progress_percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {item.universities_explored?.length || 0} universities explored
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Start exploring career fields and universities to track your progress.
                  </p>
                  <Button variant="outline" disabled>
                    Coming Soon: Field Explorer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {testResults.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Test History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{result.personality_type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(result.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        {result.recommendations?.slice(0, 3).join(', ')}
                        {result.recommendations?.length > 3 && '...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;