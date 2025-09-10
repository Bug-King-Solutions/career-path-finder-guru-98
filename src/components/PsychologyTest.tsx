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
import { supabase } from "@/integrations/supabase/client";

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

const questions: Question[] = [
  {
    id: 1,
    question: "When faced with a complex problem, I prefer to:",
    options: [
      "Break it down into logical steps and analyze each part",
      "Think creatively and explore unconventional solutions",
      "Discuss it with others and gather different perspectives",
      "Take immediate action and learn by doing"
    ],
    category: 'analytical'
  },
  {
    id: 2,
    question: "In group settings, I usually:",
    options: [
      "Take charge and organize the group's activities",
      "Generate new ideas and inspire creativity",
      "Ensure everyone's voice is heard and feelings considered",
      "Focus on practical solutions and getting things done"
    ],
    category: 'leadership'
  },
  {
    id: 3,
    question: "I feel most energized when:",
    options: [
      "Solving complex puzzles or mathematical problems",
      "Creating art, writing, or designing something new",
      "Helping others and building relationships",
      "Working with my hands or building something practical"
    ],
    category: 'creative'
  },
  {
    id: 4,
    question: "When learning something new, I prefer to:",
    options: [
      "Study theories and understand the underlying principles",
      "Experiment and explore different approaches",
      "Learn from others through discussion and collaboration",
      "Practice hands-on until I master the skill"
    ],
    category: 'social'
  },
  {
    id: 5,
    question: "My ideal work environment would be:",
    options: [
      "A quiet space where I can focus on detailed analysis",
      "A dynamic space that encourages innovation and creativity",
      "A collaborative space where I can interact with diverse people",
      "A practical workspace where I can see tangible results"
    ],
    category: 'practical'
  }
];

export const PsychologyTest = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [allQuestions, setAllQuestions] = useState<(Question | any)[]>(questions);
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
      if (!user) {
        setAllQuestions(questions);
        setLoading(false);
        return;
      }

      // Get student's school info
      const { data: studentData } = await supabase
        .from('students')
        .select('school_id')
        .eq('user_id', user.id)
        .single();

      if (!studentData?.school_id) {
        setAllQuestions(questions);
        setLoading(false);
        return;
      }

      // Get custom questions from school
      const { data: customQuestions } = await supabase
        .from('school_evaluation_questions')
        .select('*')
        .eq('school_id', studentData.school_id)
        .eq('section', 'psychology');

      if (customQuestions && customQuestions.length > 0) {
        const combinedQuestions = [...questions, ...customQuestions.map(cq => ({
          ...cq,
          isCustom: true
        }))];
        setAllQuestions(combinedQuestions);
      } else {
        setAllQuestions(questions);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setAllQuestions(questions);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQ = allQuestions[currentQuestion];
    
    if (currentQ.isCustom) {
      // For custom questions, we don't track in answers array
      if (currentQuestion < allQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(answers);
      }
    } else {
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);

      if (currentQuestion < allQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
    }
  };

  const handleCustomAnswer = (questionId: string, answer: string) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateResults = async (finalAnswers: number[]) => {
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      practical: 0,
      leadership: 0
    };

    finalAnswers.forEach((answer, index) => {
      const question = questions[index];
      // Each answer corresponds to different personality traits
      switch (answer) {
        case 0:
          scores.analytical += 1;
          break;
        case 1:
          scores.creative += 1;
          break;
        case 2:
          scores.social += 1;
          break;
        case 3:
          scores.practical += 1;
          break;
      }
    });

    // Find primary type
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
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (studentData) {
          await supabase
            .from('student_test_results')
            .insert({
              student_id: studentData.id,
              test_type: 'psychology',
              personality_type: primaryType,
              scores: scores,
              recommendations: recommendations
            });

          // Save custom answers
          const customQuestionAnswers = Object.entries(customAnswers).map(([questionId, answer]) => ({
            student_id: studentData.id,
            question_id: questionId,
            answer: answer
          }));

          if (customQuestionAnswers.length > 0) {
            await supabase
              .from('student_custom_answers')
              .insert(customQuestionAnswers);
          }

          // Update student's personality type
          await supabase
            .from('students')
            .update({ 
              personality_type: primaryType,
              test_completed: true 
            })
            .eq('id', studentData.id);
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
    setAnswers([]);
    setCustomAnswers({});
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
              <Badge variant="outline">5 Questions</Badge>
              <Badge variant="outline">3-5 Minutes</Badge>
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

  if (showResults) {
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      practical: 0,
      leadership: 0
    };

    answers.forEach((answer, index) => {
      switch (answer) {
        case 0: scores.analytical += 1; break;
        case 1: scores.creative += 1; break;
        case 2: scores.social += 1; break;
        case 3: scores.practical += 1; break;
      }
    });

    const primaryType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    const recommendations = getRecommendations(primaryType);

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
                    <span className="text-sm text-muted-foreground">{score}/5</span>
                  </div>
                  <Progress value={(score / 5) * 100} className="h-2" />
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

  const renderCustomQuestion = () => {
    switch (currentQ.question_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={customAnswers[currentQ.id] || ''}
              onValueChange={(value) => handleCustomAnswer(currentQ.id, value)}
            >
              {currentQ.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={() => handleAnswer(0)} 
              disabled={!customAnswers[currentQ.id]}
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
              value={customAnswers[currentQ.id] || ''}
              onChange={(e) => handleCustomAnswer(currentQ.id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={() => handleAnswer(0)} 
              disabled={!customAnswers[currentQ.id]?.trim()}
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
              value={customAnswers[currentQ.id] || ''}
              onValueChange={(value) => handleCustomAnswer(currentQ.id, value)}
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
              onClick={() => handleAnswer(0)} 
              disabled={!customAnswers[currentQ.id]}
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
          {currentQ.question_text || currentQ.question}
          {currentQ.isCustom && (
            <Badge variant="secondary" className="ml-2 text-xs">School Question</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQ.isCustom ? (
          renderCustomQuestion()
        ) : (
          currentQ.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start h-auto p-4 hover:bg-primary/5"
              onClick={() => handleAnswer(index)}
            >
              <span className="text-sm">{option}</span>
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  );
};