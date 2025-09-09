import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface SkillQuestion {
  id: number;
  question: string;
  options: string[];
  skill: 'analytical' | 'communication' | 'technical' | 'leadership' | 'creative';
}

const skillQuestions: SkillQuestion[] = [
  {
    id: 1,
    question: "How comfortable are you with analyzing data and identifying patterns?",
    options: [
      "Very comfortable - I love working with numbers and data",
      "Somewhat comfortable - I can do it when needed",
      "Neutral - It depends on the context",
      "Not very comfortable - I prefer other types of work"
    ],
    skill: 'analytical'
  },
  {
    id: 2,
    question: "How would you rate your ability to explain complex ideas to others?",
    options: [
      "Excellent - I can make anything understandable",
      "Good - I'm usually clear in my explanations",
      "Average - Sometimes I struggle to explain things",
      "Needs improvement - I find it challenging"
    ],
    skill: 'communication'
  },
  {
    id: 3,
    question: "How comfortable are you with technology and learning new software?",
    options: [
      "Very comfortable - I pick up new tech quickly",
      "Comfortable - I can learn with some time",
      "Somewhat comfortable - I need guidance sometimes",
      "Not very comfortable - I prefer non-technical work"
    ],
    skill: 'technical'
  },
  {
    id: 4,
    question: "How do you feel about taking charge and leading a team?",
    options: [
      "I love leading and naturally take charge",
      "I'm comfortable leading when needed",
      "I can lead but prefer to follow",
      "I prefer to avoid leadership roles"
    ],
    skill: 'leadership'
  },
  {
    id: 5,
    question: "How would you describe your ability to come up with original ideas?",
    options: [
      "I'm very creative and full of original ideas",
      "I'm quite creative and can think outside the box",
      "I have some creative moments",
      "I prefer to work with existing ideas"
    ],
    skill: 'creative'
  }
];

export const SkillsAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < skillQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    setShowResults(true);
    toast.success("Skills assessment completed!");
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTestStarted(false);
  };

  const startTest = () => {
    setTestStarted(true);
    toast.info("Starting your skills assessment...");
  };

  const getSkillsProfile = () => {
    const scores = {
      analytical: 0,
      communication: 0,
      technical: 0,
      leadership: 0,
      creative: 0
    };

    answers.forEach((answer, index) => {
      const question = skillQuestions[index];
      // Higher score for more positive responses (inverted scale: 0=4, 1=3, 2=2, 3=1)
      scores[question.skill] += (4 - answer);
    });

    // Normalize scores to percentage
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.round((scores[key as keyof typeof scores] / 4) * 100);
    });

    return scores;
  };

  if (!testStarted) {
    return (
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Skills Assessment</CardTitle>
          <p className="text-muted-foreground">
            Evaluate your current skills and identify areas for development
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">5 Questions</Badge>
              <Badge variant="outline">2-3 Minutes</Badge>
              <Badge variant="outline">Self-Evaluation</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              This assessment helps you understand your current skill levels across different areas.
            </p>
          </div>
          <Button onClick={startTest} className="w-full" size="lg">
            Start Skills Assessment
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const skillsProfile = getSkillsProfile();

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Skills Profile</CardTitle>
            <p className="text-muted-foreground">Here's your current skill assessment</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(skillsProfile).map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium capitalize">{skill}</span>
                    <span className="text-sm text-muted-foreground">{score}%</span>
                  </div>
                  <Progress value={score} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {score >= 75 ? 'Strong' : score >= 50 ? 'Developing' : 'Needs Development'}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Skill Development Recommendations</h3>
              <div className="space-y-2">
                {Object.entries(skillsProfile)
                  .filter(([_, score]) => score < 75)
                  .map(([skill, score]) => (
                    <div key={skill} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        Consider developing your <strong>{skill}</strong> skills - Current level: {score}%
                      </span>
                    </div>
                  ))
                }
                {Object.values(skillsProfile).every(score => score >= 75) && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-green-700">Great job! You have strong skills across all areas.</p>
                  </div>
                )}
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

  const progress = ((currentQuestion + 1) / skillQuestions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">Question {currentQuestion + 1} of {skillQuestions.length}</Badge>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl">{skillQuestions[currentQuestion].question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skillQuestions[currentQuestion].options.map((option, index) => (
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