import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudentAnswer {
  id: string;
  answer: string;
  answered_at: string;
  student_id: string;
  question_id: string;
  students: {
    first_name: string;
    last_name: string;
    email: string;
  };
  school_evaluation_questions: {
    question_text: string;
    question_type: string;
    section: string;
  };
}

interface Props {
  schoolId: string;
}

export const StudentAnswersView = ({ schoolId }: Props) => {
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [filteredAnswers, setFilteredAnswers] = useState<StudentAnswer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnswers();
  }, [schoolId]);

  useEffect(() => {
    const filtered = answers.filter(answer => 
      answer.students.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.students.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.students.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.school_evaluation_questions.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnswers(filtered);
  }, [answers, searchTerm]);

  const fetchAnswers = async () => {
    try {
      // First get all questions for this school
      const { data: questions, error: questionsError } = await supabase
        .from('school_evaluation_questions')
        .select('id, question_text, question_type, section')
        .eq('school_id', schoolId);

      if (questionsError) throw questionsError;

      if (!questions || questions.length === 0) {
        setAnswers([]);
        setLoading(false);
        return;
      }

      const questionIds = questions.map(q => q.id);

      // Get answers with manual join
      const { data: answersData, error: answersError } = await supabase
        .from('student_custom_answers')
        .select('*')
        .in('question_id', questionIds)
        .order('answered_at', { ascending: false });

      if (answersError) throw answersError;

      if (!answersData || answersData.length === 0) {
        setAnswers([]);
        setLoading(false);
        return;
      }

      // Get student details
      const studentIds = [...new Set(answersData.map(a => a.student_id))];
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, first_name, last_name, email')
        .in('id', studentIds);

      if (studentsError) throw studentsError;

      // Combine the data
      const formattedAnswers = answersData.map(answer => {
        const question = questions.find(q => q.id === answer.question_id);
        const student = studentsData?.find(s => s.id === answer.student_id);
        
        return {
          ...answer,
          students: student || {
            first_name: 'Unknown',
            last_name: 'Student',
            email: 'unknown@email.com'
          },
          school_evaluation_questions: question || {
            question_text: 'Unknown Question',
            question_type: 'text',
            section: 'custom'
          }
        };
      });

      setAnswers(formattedAnswers);
    } catch (error) {
      console.error('Error fetching answers:', error);
      toast.error('Failed to load student answers');
    } finally {
      setLoading(false);
    }
  };

  const groupedAnswers = filteredAnswers.reduce((groups, answer) => {
    const studentKey = `${answer.students.first_name} ${answer.students.last_name}`;
    if (!groups[studentKey]) {
      groups[studentKey] = [];
    }
    groups[studentKey].push(answer);
    return groups;
  }, {} as Record<string, StudentAnswer[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading answers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Answers to Custom Questions</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students, questions, or answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedAnswers).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No student answers found
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAnswers).map(([studentName, studentAnswers]) => (
              <div key={studentName} className="border rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{studentName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {studentAnswers[0]?.students.email}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {studentAnswers.length} answer{studentAnswers.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {studentAnswers.map((answer) => (
                    <div key={answer.id} className="border-l-4 border-primary/20 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {answer.school_evaluation_questions.section}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {answer.school_evaluation_questions.question_type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(answer.answered_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <p className="font-medium text-sm">
                          Q: {answer.school_evaluation_questions.question_text}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded p-3">
                        <p className="text-sm">
                          <span className="font-medium">A:</span> {answer.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};