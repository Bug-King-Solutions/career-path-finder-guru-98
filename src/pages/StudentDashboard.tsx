import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, Users, Target, Brain, Briefcase, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PsychologyTest } from '@/components/PsychologyTest';
import { CareerAssessment } from '@/components/CareerAssessment';
import { SkillsAssessment } from '@/components/SkillsAssessment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { getDocumentByField, queryDocuments } from '@/integrations/firebase/utils';
import { COLLECTIONS, Student, StudentTestResult, StudentProgress } from '@/integrations/firebase/types';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [testResults, setTestResults] = useState<StudentTestResult[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Fetch student profile
      const studentData = await getDocumentByField<Student>(
        COLLECTIONS.STUDENTS,
        'userId',
        user!.uid
      );

      if (studentData) {
        setStudent(studentData);

        // Fetch test results
        const resultsData = await queryDocuments<StudentTestResult>(
          COLLECTIONS.STUDENT_TEST_RESULTS,
          [{ field: 'studentId', operator: '==', value: studentData.id }],
          'completedAt',
          'desc'
        );

        if (resultsData) {
          setTestResults(resultsData);
        }

        // Fetch progress
        const progressData = await queryDocuments<StudentProgress>(
          COLLECTIONS.STUDENT_PROGRESS,
          [{ field: 'studentId', operator: '==', value: studentData.id }]
        );

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

  if (activeAssessment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setActiveAssessment(null)}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          {activeAssessment === 'psychology' && <PsychologyTest />}
          {activeAssessment === 'career' && <CareerAssessment />}
          {activeAssessment === 'skills' && <SkillsAssessment />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader studentName={student ? `${student.firstName} ${student.lastName}` : undefined} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {student?.firstName}!
          </h2>
          <p className="text-muted-foreground mt-2">
            Continue your personality assessments and career exploration journey
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
                {progress.length > 0 ? Math.round(progress.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / progress.length) : 0}%
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
                {progress.reduce((acc, p) => acc + (p.universitiesExplored?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Universities explored
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Psychology Assessment</CardTitle>
                      <p className="text-sm text-muted-foreground">Discover your personality</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testResults.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Latest Result:</span>
                        <Badge variant="secondary">{testResults[0].personalityType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Completed on {testResults[0].completedAt.toDate().toLocaleDateString()}
                      </p>
                      <Button onClick={() => setActiveAssessment('psychology')} variant="outline" className="w-full">
                        Take Test Again
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4 text-sm">
                        Discover career paths that match your personality
                      </p>
                      <Button onClick={() => setActiveAssessment('psychology')} className="w-full">
                        Start Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Career Interest</CardTitle>
                      <p className="text-sm text-muted-foreground">Explore career fields</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4 text-sm">
                      Identify which career fields interest you most
                    </p>
                    <Button onClick={() => setActiveAssessment('career')} className="w-full">
                      Start Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Skills Assessment</CardTitle>
                      <p className="text-sm text-muted-foreground">Evaluate your abilities</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4 text-sm">
                      Assess your current skills and identify growth areas
                    </p>
                    <Button onClick={() => setActiveAssessment('skills')} className="w-full">
                      Start Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Career Exploration Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress.length > 0 ? (
                  progress.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.courseField}</span>
                        <span className="text-sm text-muted-foreground">{item.progressPercentage}%</span>
                      </div>
                      <Progress value={item.progressPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.universitiesExplored?.length || 0} universities explored
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Complete assessments to start tracking your exploration progress.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                        <Badge variant="outline">{result.personalityType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {result.completedAt.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        {result.recommendations?.slice(0, 3).join(', ')}
                        {result.recommendations && result.recommendations.length > 3 && '...'}
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
