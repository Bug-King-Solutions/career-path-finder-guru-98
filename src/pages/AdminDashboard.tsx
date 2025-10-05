import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Building, Calendar, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AdminSchoolManagement } from '@/components/AdminSchoolManagement';
import { AdminStudentManagement } from '@/components/AdminStudentManagement';
import { AdminContentManagement } from '@/components/AdminContentManagement';
import { AdminQuestionManagement } from '@/components/AdminQuestionManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch all students
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentsData) {
        setStudents(studentsData);
      }

      // Fetch all schools
      const { data: schoolsData } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (schoolsData) {
        setSchools(schoolsData);
      }

      // Fetch all test results
      const { data: resultsData } = await supabase
        .from('student_test_results')
        .select('*, students(first_name, last_name)')
        .order('completed_at', { ascending: false });

      if (resultsData) {
        setTestResults(resultsData);
      }

      // Fetch all bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          students(first_name, last_name),
          schools(school_name)
        `)
        .order('created_at', { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData);
      }

      // Fetch all progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*, students(first_name, last_name)');

      if (progressData) {
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
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

  const personalityTypes = testResults.reduce((acc, result) => {
    acc[result.personality_type] = (acc[result.personality_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newStudentsThisMonth = students.filter(s => new Date(s.created_at) >= thisMonth).length;
  const newSchoolsThisMonth = schools.filter(s => new Date(s.created_at) >= thisMonth).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive overview of platform analytics and management
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{newStudentsThisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schools.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{newSchoolsThisMonth} this month
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
                    Total assessments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total bookings
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
                    Career paths
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {students.length > 0 ? Math.round((testResults.length / students.length) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Test completion
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personality Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(personalityTypes).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(personalityTypes)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <Badge variant="outline">{type}</Badge>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{count as number}</span>
                              <div className="w-16 bg-secondary h-2 rounded-full">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${testResults.length > 0 ? ((count as number) / testResults.length) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No data available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{booking.booking_type}</span>
                            <Badge 
                              variant={booking.status === 'confirmed' ? 'default' : 
                                      booking.status === 'pending' ? 'secondary' : 'destructive'}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {String(booking.students?.first_name || '')} {String(booking.students?.last_name || '')} • {String(booking.schools?.school_name || '')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No bookings yet
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.slice(0, 5).map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Test Completed</span>
                          <Badge variant="outline">{result.personality_type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {String(result.students?.first_name || '')} {String(result.students?.last_name || '')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools">
            <AdminSchoolManagement />
          </TabsContent>

          <TabsContent value="students">
            <AdminStudentManagement />
          </TabsContent>

          <TabsContent value="content">
            <AdminContentManagement />
          </TabsContent>

          <TabsContent value="questions">
            <AdminQuestionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;