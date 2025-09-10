import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id?: string;
  question_text: string;
  question_type: 'multiple_choice' | 'text' | 'rating';
  options?: string[];
  section: 'psychology' | 'career' | 'skills' | 'custom';
}

interface Props {
  schoolId: string;
}

export const SchoolEvaluationQuestions = ({ schoolId }: Props) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    section: 'custom'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [schoolId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('school_evaluation_questions')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedQuestions = data.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type as Question['question_type'],
        options: q.options ? Object.values(q.options) : undefined,
        section: q.section as Question['section']
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setSaving(true);
    try {
      const questionData = {
        school_id: schoolId,
        question_text: newQuestion.question_text,
        question_type: newQuestion.question_type,
        section: newQuestion.section,
        options: newQuestion.question_type === 'multiple_choice' 
          ? newQuestion.options?.filter(opt => opt.trim() !== '')
          : null
      };

      const { error } = await supabase
        .from('school_evaluation_questions')
        .insert([questionData]);

      if (error) throw error;

      toast.success('Question added successfully');
      setNewQuestion({
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        section: 'custom'
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('school_evaluation_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const updateNewQuestionOption = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || [])];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Evaluation Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Question</label>
            <Textarea
              value={newQuestion.question_text}
              onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
              placeholder="Enter your question here..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select
                value={newQuestion.question_type}
                onValueChange={(value) => setNewQuestion({ 
                  ...newQuestion, 
                  question_type: value as Question['question_type'],
                  options: value === 'multiple_choice' ? ['', '', '', ''] : undefined
                })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="text">Text Answer</SelectItem>
                  <SelectItem value="rating">Rating (1-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Section</label>
              <Select
                value={newQuestion.section}
                onValueChange={(value) => setNewQuestion({ 
                  ...newQuestion, 
                  section: value as Question['section']
                })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychology">Psychology Assessment</SelectItem>
                  <SelectItem value="career">Career Interest</SelectItem>
                  <SelectItem value="skills">Skills Assessment</SelectItem>
                  <SelectItem value="custom">Custom Section</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {newQuestion.question_type === 'multiple_choice' && (
            <div>
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2 mt-1">
                {newQuestion.options?.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => updateNewQuestionOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleAddQuestion} disabled={saving} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {saving ? 'Adding...' : 'Add Question'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No custom questions created yet
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {question.section}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {question.question_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="font-medium mb-2">{question.question_text}</p>
                      {question.options && (
                        <div className="text-sm text-muted-foreground">
                          Options: {question.options.filter(opt => opt.trim() !== '').join(', ')}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => question.id && handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};