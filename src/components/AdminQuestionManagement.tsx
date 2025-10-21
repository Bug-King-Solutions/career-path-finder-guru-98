import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { queryDocuments, createDocument, updateDocument, deleteDocument } from '@/integrations/firebase/utils';
import { COLLECTIONS, SchoolEvaluationQuestion } from '@/integrations/firebase/types';
import { Timestamp } from 'firebase/firestore';

const QUESTION_TYPES = ['multiple_choice', 'text', 'rating'] as const;
const SECTIONS = ['psychology', 'career', 'skills'] as const;

export const AdminQuestionManagement = () => {
  const [questions, setQuestions] = useState<SchoolEvaluationQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SchoolEvaluationQuestion | null>(null);
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'multiple_choice' as typeof QUESTION_TYPES[number],
    section: 'psychology' as typeof SECTIONS[number],
    options: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // Get all global questions (no schoolId)
      const data = await queryDocuments<SchoolEvaluationQuestion>(
        COLLECTIONS.SCHOOL_EVALUATION_QUESTIONS,
        [],
        'createdAt',
        'desc'
      );

      if (data) {
        // Filter for global questions only
        const globalQuestions = data.filter(q => !q.schoolId);
        setQuestions(globalQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.questionText) {
      toast.error('Question text is required');
      return;
    }

    if (formData.questionType === 'multiple_choice' && !formData.options) {
      toast.error('Options are required for multiple choice questions');
      return;
    }

    try {
      let parsedOptions: any = null;
      
      if (formData.questionType === 'multiple_choice') {
        try {
          parsedOptions = JSON.parse(formData.options);
          if (!Array.isArray(parsedOptions)) {
            toast.error('Options must be a JSON array');
            return;
          }
        } catch {
          toast.error('Invalid JSON format for options');
          return;
        }
      }

      await createDocument(COLLECTIONS.SCHOOL_EVALUATION_QUESTIONS, {
        questionText: formData.questionText,
        questionType: formData.questionType,
        section: formData.section,
        options: parsedOptions,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success('Question created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question');
    }
  };

  const handleUpdate = async () => {
    if (!selectedQuestion || !formData.questionText) {
      toast.error('Question text is required');
      return;
    }

    if (formData.questionType === 'multiple_choice' && !formData.options) {
      toast.error('Options are required for multiple choice questions');
      return;
    }

    try {
      let parsedOptions: any = null;
      
      if (formData.questionType === 'multiple_choice') {
        try {
          parsedOptions = JSON.parse(formData.options);
          if (!Array.isArray(parsedOptions)) {
            toast.error('Options must be a JSON array');
            return;
          }
        } catch {
          toast.error('Invalid JSON format for options');
          return;
        }
      }

      await updateDocument(COLLECTIONS.SCHOOL_EVALUATION_QUESTIONS, selectedQuestion.id, {
        questionText: formData.questionText,
        questionType: formData.questionType,
        section: formData.section,
        options: parsedOptions,
        updatedAt: Timestamp.now()
      });

      toast.success('Question updated successfully');
      setIsEditDialogOpen(false);
      setSelectedQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question');
    }
  };

  const handleDelete = async (question: SchoolEvaluationQuestion) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await deleteDocument(COLLECTIONS.SCHOOL_EVALUATION_QUESTIONS, question.id);
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const openEditDialog = (question: SchoolEvaluationQuestion) => {
    setSelectedQuestion(question);
    setFormData({
      questionText: question.questionText,
      questionType: question.questionType as typeof QUESTION_TYPES[number],
      section: question.section as typeof SECTIONS[number],
      options: question.options ? JSON.stringify(question.options, null, 2) : ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      questionType: 'multiple_choice',
      section: 'psychology',
      options: ''
    });
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = filterSection === 'all' || question.section === filterSection;
    return matchesSearch && matchesSection;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading questions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Question Bank Management</CardTitle>
                <p className="text-sm text-muted-foreground">Manage global assessment questions</p>
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="psychology">Psychology</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredQuestions.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium max-w-md truncate">
                        {question.questionText}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {question.questionType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {question.section}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {question.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(question)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(question)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || filterSection !== 'all'
                ? 'No questions found matching your filters'
                : 'No questions yet. Create one to get started.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="section">Section *</Label>
              <Select
                value={formData.section}
                onValueChange={(value) => setFormData(prev => ({ ...prev, section: value as typeof SECTIONS[number] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Question Type *</Label>
              <Select
                value={formData.questionType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, questionType: value as typeof QUESTION_TYPES[number] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="questionText">Question Text *</Label>
              <Textarea
                id="questionText"
                value={formData.questionText}
                onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
                placeholder="Enter your question"
                rows={3}
              />
            </div>
            {formData.questionType === 'multiple_choice' && (
              <div>
                <Label htmlFor="options">Options (JSON Array) *</Label>
                <Textarea
                  id="options"
                  value={formData.options}
                  onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                  placeholder='["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter options as a JSON array
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-section">Section *</Label>
              <Select
                value={formData.section}
                onValueChange={(value) => setFormData(prev => ({ ...prev, section: value as typeof SECTIONS[number] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-type">Question Type *</Label>
              <Select
                value={formData.questionType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, questionType: value as typeof QUESTION_TYPES[number] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-questionText">Question Text *</Label>
              <Textarea
                id="edit-questionText"
                value={formData.questionText}
                onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
                placeholder="Enter your question"
                rows={3}
              />
            </div>
            {formData.questionType === 'multiple_choice' && (
              <div>
                <Label htmlFor="edit-options">Options (JSON Array) *</Label>
                <Textarea
                  id="edit-options"
                  value={formData.options}
                  onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                  placeholder='["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter options as a JSON array
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedQuestion(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
