import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, BookOpen, TrendingUp, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SchoolEvaluationQuestions } from '@/components/SchoolEvaluationQuestions';
import { StudentAnswersView } from '@/components/StudentAnswersView';
import { StudentManagement } from '@/components/StudentManagement';

const SchoolDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [school, setSchool] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSchoolData();
    }
  }, [user]);

  const fetchSchoolData = async () => {
    try {
      // Fetch school profile
      const { data: schoolData } = await supabase
        .from('schools')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (schoolData) {
        setSchool(schoolData);
      }

      // Fetch students from this school only
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolData.id)
        .order('created_at', { ascending: false });

      if (studentsData) {
        setStudents(studentsData);

        // Fetch test results for all students
        const studentIds = studentsData.map(s => s.id);
        if (studentIds.length > 0) {
          const { data: resultsData } = await supabase
            .from('student_test_results')
            .select('*, students(first_name, last_name)')
            .in('student_id', studentIds)
            .order('completed_at', { ascending: false });

          if (resultsData) {
            setTestResults(resultsData);
          }

          // Fetch progress for all students
          const { data: progressData } = await supabase
            .from('student_progress')
            .select('*, students(first_name, last_name)')
            .in('student_id', studentIds);

          if (progressData) {
            setProgress(progressData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching school data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async () => {
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setCreateLoading(true);
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: newStudent.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: newStudent.firstName,
            last_name: newStudent.lastName
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create student profile
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            first_name: newStudent.firstName,
            last_name: newStudent.lastName,
            email: newStudent.email,
            school_id: school.id
          });

        if (studentError) throw studentError;

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'student'
          });

        if (roleError) throw roleError;

        toast({
          title: "Success",
          description: "Student created successfully"
        });

        setNewStudent({ firstName: '', lastName: '', email: '', password: '' });
        setIsCreateDialogOpen(false);
        fetchSchoolData();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create student",
        variant: "destructive"
      });
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const personalityTypes = testResults.reduce((acc, result) => {
    acc[result.personality_type] = (acc[result.personality_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader studentName={school?.school_name} />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="manage">Manage Students</TabsTrigger>
            <TabsTrigger value="questions">Custom Questions</TabsTrigger>
            <TabsTrigger value="answers">Student Answers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {school?.school_name || 'School Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor student progress and career exploration activities
              </p>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testResults.length}</div>
              <p className="text-xs text-muted-foreground">
                Total assessments taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.length}</div>
              <p className="text-xs text-muted-foreground">
                Career exploration paths
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.length > 0 ? Math.round((testResults.length / students.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Students who took tests
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(personalityTypes).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(personalityTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <Badge variant="outline">{type}</Badge>
                      <span className="text-sm font-medium">{count as number} students</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No test results available yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.slice(0, 5).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {String(result.students?.first_name || '')} {String(result.students?.last_name || '')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{result.personality_type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No recent test results
                </p>
              )}
            </CardContent>
          </Card>
        </div>

          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Students</CardTitle>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Add Student
                </Button>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students.map((student, index) => {
                      const studentTests = testResults.filter(r => r.student_id === student.id);
                      const studentProgress = progress.filter(p => p.student_id === student.id);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {student.first_name} {student.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">
                                {studentTests.length} tests
                              </Badge>
                              <Badge variant="outline">
                                {studentProgress.length} career paths
                              </Badge>
                              {student.test_completed && (
                                <Badge variant="default">Test Complete</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Joined: {new Date(student.created_at).toLocaleDateString()}
                            </p>
                            {studentTests.length > 0 && (
                              <Badge variant="secondary" className="mt-1">
                                {studentTests[0].personality_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No students registered yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            {school && <SchoolEvaluationQuestions schoolId={school.id} />}
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            {school && (
              <StudentManagement 
                schoolId={school.id} 
                students={students} 
                onStudentUpdate={fetchSchoolData}
              />
            )}
          </TabsContent>

          <TabsContent value="answers" className="mt-6">
            {school && <StudentAnswersView schoolId={school.id} />}
          </TabsContent>
        </Tabs>

        {/* Create Student Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Student</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createStudent} disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SchoolDashboard;