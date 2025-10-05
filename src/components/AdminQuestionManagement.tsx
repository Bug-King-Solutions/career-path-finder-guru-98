import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'text' | 'rating';
  section: string;
  options: string[] | null;
  school_id: string | null;
}

export const AdminQuestionManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice' as const,
    section: 'psychology',
    options: ['', '', '', '']
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('school_evaluation_questions')
        .select('*')
        .is('school_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const questionData: any = {
        question_text: newQuestion.question_text,
        question_type: newQuestion.question_type,
        section: newQuestion.section,
        school_id: null // null means it's a global admin question
      };

      if (newQuestion.question_type === 'multiple_choice') {
        const validOptions = newQuestion.options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
          toast.error('Please provide at least 2 options');
          return;
        }
        questionData.options = validOptions;
      }

      const { error } = await supabase
        .from('school_evaluation_questions')
        .insert([questionData]);

      if (error) throw error;

      toast.success('Question created successfully');
      setIsDialogOpen(false);
      setNewQuestion({
        question_text: '',
        question_type: 'multiple_choice',
        section: 'psychology',
        options: ['', '', '', '']
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question');
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

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Question Management</h2>
          <p className="text-muted-foreground">Create and manage assessment questions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={newQuestion.section}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psychology">Psychology Assessment</SelectItem>
                    <SelectItem value="career">Career Guidance</SelectItem>
                    <SelectItem value="skills">Skills Assessment</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-type">Question Type</Label>
                <Select
                  value={newQuestion.question_type}
                  onValueChange={(value: any) => setNewQuestion({ ...newQuestion, question_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="text">Text Response</SelectItem>
                    <SelectItem value="rating">Rating (1-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  placeholder="Enter your question here..."
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                  rows={3}
                />
              </div>

              {newQuestion.question_type === 'multiple_choice' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {newQuestion.options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuestion}>
                  Create Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No questions created yet. Click "Create Question" to add one.
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{question.section}</Badge>
                      <Badge variant="secondary">{question.question_type.replace('_', ' ')}</Badge>
                    </div>
                    <CardTitle className="text-base">{question.question_text}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              {question.options && question.options.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Options:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {question.options.map((option, index) => (
                        <li key={index} className="text-sm">{option}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
