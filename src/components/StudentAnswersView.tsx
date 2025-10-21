import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import { queryDocuments, getAllDocuments } from '@/integrations/firebase/utils';
import { COLLECTIONS, Student, StudentCustomAnswer, SchoolEvaluationQuestion } from '@/integrations/firebase/types';

interface StudentAnswersViewProps {
  schoolId: string;
}

export const StudentAnswersView = ({ schoolId }: StudentAnswersViewProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [answers, setAnswers] = useState<StudentCustomAnswer[]>([]);
  const [questions, setQuestions] = useState<SchoolEvaluationQuestion[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch students from this school
      const studentsData = await queryDocuments<Student>(
        COLLECTIONS.STUDENTS,
        [{ field: 'schoolId', operator: '==', value: schoolId }]
      );
      if (studentsData) {
        setStudents(studentsData);
      }

      // Fetch school's custom questions
      const questionsData = await queryDocuments<SchoolEvaluationQuestion>(
        COLLECTIONS.SCHOOL_EVALUATION_QUESTIONS,
        [{ field: 'schoolId', operator: '==', value: schoolId }]
      );
      if (questionsData) {
        setQuestions(questionsData);
      }

      // Fetch all answers from students in this school
      if (studentsData && studentsData.length > 0) {
        const studentIds = studentsData.map(s => s.id);
        const allAnswers: StudentCustomAnswer[] = [];
        
        for (const studentId of studentIds) {
          const studentAnswers = await queryDocuments<StudentCustomAnswer>(
            COLLECTIONS.STUDENT_CUSTOM_ANSWERS,
            [{ field: 'studentId', operator: '==', value: studentId }]
          );
          if (studentAnswers) {
            allAnswers.push(...studentAnswers);
          }
        }
        
        setAnswers(allAnswers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load student answers');
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getQuestionText = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question?.questionText || 'Question not found';
  };

  const filteredAnswers = selectedStudent === 'all' 
    ? answers 
    : answers.filter(a => a.studentId === selectedStudent);

  // Only show answers for this school's custom questions
  const relevantAnswers = filteredAnswers.filter(answer => 
    questions.some(q => q.id === answer.questionId)
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading answers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Student Answers</CardTitle>
              <p className="text-sm text-muted-foreground">
                View responses to your custom questions
              </p>
            </div>
          </div>
          <div className="w-64">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No custom questions created yet. Create questions in the "Custom Questions" tab to see student responses here.
          </div>
        ) : relevantAnswers.length > 0 ? (
          <div className="space-y-6">
            {students
              .filter(student => 
                selectedStudent === 'all' || student.id === selectedStudent
              )
              .map((student) => {
                const studentAnswers = relevantAnswers.filter(a => a.studentId === student.id);
                
                if (studentAnswers.length === 0) return null;
                
                return (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      <Badge variant="secondary" className="ml-2">
                        {studentAnswers.length} answers
                      </Badge>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/2">Question</TableHead>
                          <TableHead>Answer</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentAnswers.map((answer) => (
                          <TableRow key={answer.id}>
                            <TableCell className="font-medium">
                              {getQuestionText(answer.questionId)}
                            </TableCell>
                            <TableCell>{answer.answer}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {answer.answeredAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {selectedStudent === 'all' 
              ? 'No student responses yet. Students will see your custom questions when taking assessments.'
              : 'This student has not answered any custom questions yet.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
