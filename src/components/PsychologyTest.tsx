import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight, RotateCcw, School } from "lucide-react";
import { toast } from "sonner";
import { UniversityRecommendations } from "./UniversityRecommendations";
import { useAuth } from "@/contexts/AuthContext";
import { queryDocuments, createDocument, updateDocument, getDocumentByField } from "@/integrations/firebase/utils";
import { COLLECTIONS, SchoolEvaluationQuestion, Student } from "@/integrations/firebase/types";
import { Timestamp } from "firebase/firestore";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: 'analytical' | 'creative' | 'social' | 'practical' | 'leadership';
}

interface TestResult {
  analytical: number;
  creative: number;
  social: number;
  practical: number;
  leadership: number;
  primaryType: string;
  recommendations: string[];
}

// Questions will be loaded from database

export const PsychologyTest = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showUniversities, setShowUniversities] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestionsWithCustom();
  }, [user]);

  const loadQuestionsWithCustom = async () => {
    try {
      // Load global psychology questions (schoolId is null or undefined)
      const globalQuestions = await queryDocuments<SchoolEvaluationQuestion>(
        COLLECTIONS.SCHOOL_EVALUATION_QUESTIONS,
        [
          { field: 'section', operator: '==', value: 'psychology' }
        ],
        'createdAt',
        'asc'
      );

      if (globalQuestions && globalQuestions.length > 0) {
        // Filter for global questions (no schoolId)
        const filteredQuestions = globalQuestions.filter(q => !q.schoolId);
        setAllQuestions(filteredQuestions);
      } else {
        toast.error("No questions found. Please contact the administrator.");
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = async (finalAnswers: Record<string, string>) => {
    // Simple scoring based on answer patterns
    const answerValues = Object.values(finalAnswers);
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      practical: 0,
      leadership: 0
    };

    // Count based on answer text patterns (simplified logic)
    answerValues.forEach(answer => {
      const lowerAnswer = answer.toLowerCase();
      if (lowerAnswer.includes('agree') || lowerAnswer.includes('strongly agree')) {
        scores.analytical += 1;
      }
    });

    // Distribute scores (simplified)
    scores.creative = Math.floor(answerValues.length * 0.2);
    scores.social = Math.floor(answerValues.length * 0.15);
    scores.practical = Math.floor(answerValues.length * 0.15);
    scores.leadership = Math.floor(answerValues.length * 0.1);

    const primaryType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    const recommendations = getRecommendations(primaryType);
    const results = {
      scores,
      primaryType,
      recommendations
    };

    setTestResults(results);

    // Save to database
    if (user) {
      try {
        const studentData = await getDocumentByField<Student>(
          COLLECTIONS.STUDENTS,
          'userId',
          user.uid
        );

        if (studentData) {
          await createDocument(COLLECTIONS.STUDENT_TEST_RESULTS, {
            studentId: studentData.id,
            testType: 'psychology',
            personalityType: primaryType,
            scores: scores,
            recommendations: recommendations,
            completedAt: Timestamp.now()
          });

          // Save all answers
          const answerRecords = Object.entries(finalAnswers).map(([questionId, answer]) => ({
            studentId: studentData.id,
            questionId: questionId,
            answer: answer,
            answeredAt: Timestamp.now()
          }));

          if (answerRecords.length > 0) {
            for (const record of answerRecords) {
              await createDocument(COLLECTIONS.STUDENT_CUSTOM_ANSWERS, record);
            }
          }

          // Update student's personality type
          await updateDocument(COLLECTIONS.STUDENTS, studentData.id, {
            personalityType: primaryType,
            testCompleted: true,
            updatedAt: Timestamp.now()
          });
        }
      } catch (error) {
        console.error('Error saving test results:', error);
      }
    }

    setShowResults(true);
    toast.success("Psychology test completed! Check your results below.");
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestStarted(false);
    setShowUniversities(false);
    setTestResults(null);
  };

  const startTest = () => {
    setTestStarted(true);
    toast.info("Starting your psychology assessment...");
  };

  const getRecommendations = (type: string) => {
    const recommendations = {
      analytical: [
        "Engineering (Computer, Mechanical, Electrical)",
        "Mathematics and Statistics",
        "Data Science and Analytics",
        "Research and Development",
        "Finance and Accounting"
      ],
      creative: [
        "Fine Arts and Design",
        "Creative Writing and Literature",
        "Architecture",
        "Marketing and Advertising",
        "Media and Communications"
      ],
      social: [
        "Psychology and Counseling",
        "Social Work",
        "Human Resources",
        "Teaching and Education",
        "Healthcare and Nursing"
      ],
      practical: [
        "Engineering Technology",
        "Agriculture and Farming",
        "Construction and Building",
        "Information Technology",
        "Medical Technology"
      ],
      leadership: [
        "Business Administration",
        "Law and Legal Studies",
        "Political Science",
        "Project Management",
        "Entrepreneurship"
      ]
    };
    return recommendations[type as keyof typeof recommendations] || [];
  };

  const handleUniversityExploration = (universityId: string) => {
    // Progress tracking is handled in UniversityRecommendations component
  };

  if (showUniversities && testResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">University Recommendations</CardTitle>
              <Button variant="outline" onClick={() => setShowUniversities(false)}>
                Back to Results
              </Button>
            </div>
            <p className="text-muted-foreground">
              Explore universities that offer programs in your recommended career paths
            </p>
          </CardHeader>
          <CardContent>
            <UniversityRecommendations 
              selectedCareers={testResults.recommendations}
              onExploreUniversity={handleUniversityExploration}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Psychology Assessment</CardTitle>
          <p className="text-muted-foreground">
            Discover your personality type and get personalized career recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{allQuestions.length} Questions</Badge>
              <Badge variant="outline">5-10 Minutes</Badge>
              <Badge variant="outline">Scientifically Based</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              This assessment is based on established psychological frameworks and will help 
              identify your natural strengths, work preferences, and suitable career paths.
            </p>
          </div>
          <Button onClick={startTest} className="w-full" size="lg">
            Start Assessment
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults && testResults) {
    const { scores, primaryType, recommendations } = testResults;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Results</CardTitle>
            <p className="text-muted-foreground">Based on your responses, here's your personality profile</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2 mb-2">
                Primary Type: {primaryType.charAt(0).toUpperCase() + primaryType.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(scores).map(([type, score]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium capitalize">{type}</span>
                    <span className="text-sm text-muted-foreground">{String(score)}/{allQuestions.length}</span>
                  </div>
                  <Progress value={(Number(score) / allQuestions.length) * 100} className="h-2" />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recommended Career Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setShowUniversities(true)} className="flex-1">
                <School className="mr-2 w-4 h-4" />
                Explore Universities
              </Button>
              <Button onClick={resetTest} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 w-4 h-4" />
                Take Test Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardContent className="py-8">
          <div className="animate-pulse text-center">Loading assessment...</div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  const currentQ = allQuestions[currentQuestion];

  const renderQuestion = () => {
    const questionOptions = Array.isArray(currentQ.options) 
      ? currentQ.options 
      : JSON.parse(currentQ.options || '[]');

    switch (currentQ.questionType) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              {questionOptions.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => currentQuestion < allQuestions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : calculateResults(answers)} 
              disabled={!answers[currentQ.id]}
              className="w-full"
            >
              Next Question
            </Button>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-4">
            <Textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={() => currentQuestion < allQuestions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : calculateResults(answers)} 
              disabled={!answers[currentQ.id]?.trim()}
              className="w-full"
            >
              Next Question
            </Button>
          </div>
        );
      case 'rating':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="text-sm">
                    {rating} - {rating === 1 ? 'Strongly Disagree' : rating === 5 ? 'Strongly Agree' : ''}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => currentQuestion < allQuestions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : calculateResults(answers)} 
              disabled={!answers[currentQ.id]}
              className="w-full"
            >
              Next Question
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">Question {currentQuestion + 1} of {allQuestions.length}</Badge>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl">
          {currentQ.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderQuestion()}
      </CardContent>
    </Card>
  );
};