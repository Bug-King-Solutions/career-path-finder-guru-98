import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface CareerQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'technical' | 'business' | 'healthcare' | 'education' | 'creative';
}

const careerQuestions: CareerQuestion[] = [
  {
    id: 1,
    question: "What type of work environment appeals to you most?",
    options: [
      "High-tech labs and research facilities",
      "Corporate offices and boardrooms", 
      "Hospitals and clinics",
      "Schools and educational institutions",
      "Studios and creative spaces"
    ],
    category: 'technical'
  },
  {
    id: 2,
    question: "Which type of impact do you want to make?",
    options: [
      "Develop innovative technologies",
      "Build successful businesses",
      "Improve people's health and wellbeing",
      "Educate and inspire others",
      "Create beautiful and meaningful art"
    ],
    category: 'business'
  },
  {
    id: 3,
    question: "What motivates you most in your work?",
    options: [
      "Solving complex technical problems",
      "Leading teams and making strategic decisions",
      "Caring for and helping people",
      "Sharing knowledge and mentoring",
      "Expressing creativity and originality"
    ],
    category: 'healthcare'
  },
  {
    id: 4,
    question: "Which skills do you want to develop further?",
    options: [
      "Programming, engineering, and data analysis",
      "Management, finance, and entrepreneurship",
      "Medical knowledge and patient care",
      "Teaching methods and curriculum design",
      "Artistic techniques and design thinking"
    ],
    category: 'education'
  },
  {
    id: 5,
    question: "What type of challenges excite you?",
    options: [
      "Building systems and optimizing processes",
      "Growing markets and increasing profits",
      "Diagnosing and treating conditions",
      "Helping students overcome learning barriers",
      "Bringing imaginative ideas to life"
    ],
    category: 'creative'
  }
];

export const CareerAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < careerQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    setShowResults(true);
    toast.success("Career assessment completed!");
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTestStarted(false);
  };

  const startTest = () => {
    setTestStarted(true);
    toast.info("Starting your career assessment...");
  };

  const getCareerRecommendations = () => {
    const scores = {
      technical: 0,
      business: 0,
      healthcare: 0,
      education: 0,
      creative: 0
    };

    answers.forEach((answer) => {
      switch (answer) {
        case 0: scores.technical += 1; break;
        case 1: scores.business += 1; break;
        case 2: scores.healthcare += 1; break;
        case 3: scores.education += 1; break;
        case 4: scores.creative += 1; break;
      }
    });

    const primaryField = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    const recommendations = {
      technical: ["Computer Science", "Engineering", "Information Technology", "Data Science"],
      business: ["Business Administration", "Economics", "Marketing", "Finance"],
      healthcare: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
      education: ["Education", "Psychology", "Linguistics", "Library Science"],
      creative: ["Fine Arts", "Design", "Media Studies", "Creative Writing"]
    };

    return { primaryField, careers: recommendations[primaryField as keyof typeof recommendations] || [] };
  };

  if (!testStarted) {
    return (
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Career Interest Assessment</CardTitle>
          <p className="text-muted-foreground">
            Explore different career fields and discover what interests you most
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">5 Questions</Badge>
              <Badge variant="outline">2-3 Minutes</Badge>
              <Badge variant="outline">Career Focused</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              This assessment helps identify which career fields align with your interests and aspirations.
            </p>
          </div>
          <Button onClick={startTest} className="w-full" size="lg">
            Start Career Assessment
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const { primaryField, careers } = getCareerRecommendations();

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Career Interests</CardTitle>
            <p className="text-muted-foreground">Based on your responses, here are your career interests</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2 mb-2">
                Primary Interest: {primaryField.charAt(0).toUpperCase() + primaryField.slice(1)}
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recommended Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {careers.map((career, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={resetTest} variant="outline" className="w-full">
              <RotateCcw className="mr-2 w-4 h-4" />
              Take Assessment Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / careerQuestions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">Question {currentQuestion + 1} of {careerQuestions.length}</Badge>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl">{careerQuestions[currentQuestion].question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {careerQuestions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left justify-start h-auto p-4 hover:bg-primary/5"
            onClick={() => handleAnswer(index)}
          >
            <span className="text-sm">{option}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};