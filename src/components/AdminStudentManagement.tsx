import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, GraduationCap, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { getAllDocuments, queryDocuments } from '@/integrations/firebase/utils';
import { COLLECTIONS, Student, School, StudentTestResult } from '@/integrations/firebase/types';

export const AdminStudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [testResults, setTestResults] = useState<Record<string, StudentTestResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterTestStatus, setFilterTestStatus] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all students
      const studentsData = await getAllDocuments<Student>(COLLECTIONS.STUDENTS);
      if (studentsData) {
        setStudents(studentsData);

        // Fetch test results for all students
        const resultsMap: Record<string, StudentTestResult[]> = {};
        for (const student of studentsData) {
          const results = await queryDocuments<StudentTestResult>(
            COLLECTIONS.STUDENT_TEST_RESULTS,
            [{ field: 'studentId', operator: '==', value: student.id }]
          );
          if (results) {
            resultsMap[student.id] = results;
          }
        }
        setTestResults(resultsMap);
      }

      // Fetch all schools
      const schoolsData = await getAllDocuments<School>(COLLECTIONS.SCHOOLS);
      if (schoolsData) {
        setSchools(schoolsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const getSchoolName = (schoolId?: string) => {
    if (!schoolId) return 'Independent';
    const school = schools.find(s => s.id === schoolId);
    return school?.schoolName || 'Unknown';
  };

  const getTestCount = (studentId: string) => {
    return testResults[studentId]?.length || 0;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSchool = filterSchool === 'all' || student.schoolId === filterSchool;
    
    const matchesTestStatus = 
      filterTestStatus === 'all' ||
      (filterTestStatus === 'completed' && student.testCompleted) ||
      (filterTestStatus === 'pending' && !student.testCompleted);
    
    return matchesSearch && matchesSchool && matchesTestStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading students...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Student Management</CardTitle>
            <p className="text-sm text-muted-foreground">View and manage all students</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSchool} onValueChange={setFilterSchool}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              <SelectItem value="independent">Independent</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.schoolName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTestStatus} onValueChange={setFilterTestStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by test status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Test Completed</SelectItem>
              <SelectItem value="pending">Test Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Total: {filteredStudents.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Completed Tests: {filteredStudents.filter(s => s.testCompleted).length}</span>
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Tests Taken</TableHead>
                  <TableHead>Personality</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell>{getSchoolName(student.schoolId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTestCount(student.id)}</Badge>
                    </TableCell>
                    <TableCell>
                      {student.personalityType ? (
                        <Badge variant="secondary">{student.personalityType}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not tested</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.testCompleted ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery || filterSchool !== 'all' || filterTestStatus !== 'all'
              ? 'No students found matching your filters'
              : 'No students yet'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
