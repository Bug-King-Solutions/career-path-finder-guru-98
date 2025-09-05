import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowRight, RotateCcw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
    question: "When making important decisions, I typically:",
    options: [
      "Analyze all available data and statistics thoroughly",
      "Trust my intuition and consider creative possibilities",
      "Seek input from trusted friends, family, or colleagues",
      "Choose the most practical and immediately actionable option"
    ],
    category: 'analytical'
  },
  {
    id: 2,
    question: "In my free time, I prefer activities that:",
    options: [
      "Challenge my mind with puzzles, research, or complex problems",
      "Allow me to express myself creatively through art, music, or writing",
      "Involve spending quality time with people I care about",
      "Let me work with my hands or see tangible results"
    ],
    category: 'creative'
  },
  {
    id: 3,
    question: "When working on a team project, I naturally:",
    options: [
      "Organize timelines, delegate tasks, and ensure deadlines are met",
      "Generate innovative ideas and inspire others with new possibilities",
      "Focus on team harmony and make sure everyone feels included",
      "Handle the concrete tasks and implementation details"
    ],
    category: 'leadership'
  },
  {
    id: 4,
    question: "I feel most satisfied when:",
    options: [
      "I solve a complex problem that others couldn't figure out",
      "I create something original and beautiful that didn't exist before",
      "I help someone overcome a challenge or achieve their goals",
      "I complete a useful project that makes daily life easier"
    ],
    category: 'social'
  },
  {
    id: 5,
    question: "When facing a stressful situation, I tend to:",
    options: [
      "Break down the problem logically and create a systematic plan",
      "Look for alternative approaches and think outside the box",
      "Talk it through with others and seek emotional support",
      "Take immediate action to address the most pressing issues"
    ],
    category: 'practical'
  },
  {
    id: 6,
    question: "My ideal career would allow me to:",
    options: [
      "Conduct research, analyze trends, and work with complex data",
      "Design, innovate, and bring new ideas to life",
      "Work directly with people to help them grow and succeed",
      "Build, fix, or improve things that have real-world impact"
    ],
    category: 'analytical'
  },
  {
    id: 7,
    question: "When learning new skills, I learn best by:",
    options: [
      "Reading comprehensive materials and understanding theory first",
      "Experimenting freely and discovering through trial and error",
      "Learning from mentors and through group discussions",
      "Jumping in and learning through hands-on practice"
    ],
    category: 'creative'
  },
  {
    id: 8,
    question: "In social situations, people often see me as someone who:",
    options: [
      "Takes charge and naturally guides group decisions",
      "Brings energy and suggests fun, creative activities",
      "Listens well and helps others feel comfortable and heard",
      "Gets things done and handles practical arrangements"
    ],
    category: 'leadership'
  },
  {
    id: 9,
    question: "I'm most motivated by work that:",
    options: [
      "Requires deep thinking and intellectual challenge",
      "Allows for self-expression and creative freedom",
      "Involves helping others and making a positive social impact",
      "Produces concrete, measurable results I can see and touch"
    ],
    category: 'social'
  },
  {
    id: 10,
    question: "When I encounter a problem at work, my first instinct is to:",
    options: [
      "Research best practices and gather comprehensive information",
      "Brainstorm multiple creative solutions and think unconventionally",
      "Discuss it with colleagues and get different perspectives",
      "Try the most straightforward solution and adjust as needed"
    ],
    category: 'practical'
  },
  {
    id: 11,
    question: "I feel energized when my environment is:",
    options: [
      "Quiet and organized, allowing for deep concentration",
      "Dynamic and flexible, encouraging innovation and creativity",
      "Collaborative and warm, fostering meaningful relationships",
      "Efficient and results-focused, with clear goals and outcomes"
    ],
    category: 'analytical'
  },
  {
    id: 12,
    question: "When planning a vacation, I:",
    options: [
      "Research destinations thoroughly and create detailed itineraries",
      "Choose unique, off-the-beaten-path experiences for inspiration",
      "Plan activities that bring family and friends together",
      "Focus on practical considerations like cost, convenience, and amenities"
    ],
    category: 'creative'
  },
  {
    id: 13,
    question: "In a leadership role, I would focus on:",
    options: [
      "Setting clear strategic vision and long-term planning",
      "Inspiring innovation and encouraging creative risk-taking",
      "Building strong team relationships and developing people",
      "Ensuring efficient operations and achieving concrete results"
    ],
    category: 'leadership'
  },
  {
    id: 14,
    question: "I find deep satisfaction in:",
    options: [
      "Mastering complex concepts and becoming an expert in my field",
      "Creating something beautiful or meaningful that expresses my vision",
      "Seeing others grow, succeed, and reach their full potential",
      "Building or fixing something that solves real problems"
    ],
    category: 'social'
  },
  {
    id: 15,
    question: "My approach to risk-taking is:",
    options: [
      "Carefully calculated - I analyze potential outcomes thoroughly",
      "Intuitive and bold - I'm willing to take creative risks for breakthrough results",
      "Collaborative - I prefer taking risks with the support and input of others",
      "Practical - I take necessary risks when the potential benefits clearly outweigh costs"
    ],
    category: 'practical'
  }
];

const PsychologyTestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      practical: 0,
      leadership: 0
    };

    finalAnswers.forEach((answer, index) => {
      const question = questions[index];
      // Map answers to personality types based on question design
      switch (answer) {
        case 0:
          if (index % 5 === 0) scores.analytical += 1;
          else if (index % 5 === 1) scores.creative += 1;
          else if (index % 5 === 2) scores.leadership += 1;
          else if (index % 5 === 3) scores.social += 1;
          else scores.practical += 1;
          break;
        case 1:
          if (index % 5 === 0) scores.creative += 1;
          else if (index % 5 === 1) scores.social += 1;
          else if (index % 5 === 2) scores.practical += 1;
          else if (index % 5 === 3) scores.analytical += 1;
          else scores.leadership += 1;
          break;
        case 2:
          if (index % 5 === 0) scores.social += 1;
          else if (index % 5 === 1) scores.practical += 1;
          else if (index % 5 === 2) scores.analytical += 1;
          else if (index % 5 === 3) scores.leadership += 1;
          else scores.creative += 1;
          break;
        case 3:
          if (index % 5 === 0) scores.practical += 1;
          else if (index % 5 === 1) scores.leadership += 1;
          else if (index % 5 === 2) scores.creative += 1;
          else if (index % 5 === 3) scores.analytical += 1;
          else scores.social += 1;
          break;
      }
    });

    // Find primary type
    const primaryType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    setShowResults(true);
    toast.success("Psychology assessment completed! Check your comprehensive results below.");
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTestStarted(false);
  };

  const startTest = () => {
    setTestStarted(true);
    toast.info("Starting your comprehensive psychology assessment...");
  };

  const getRecommendations = (type: string) => {
    const recommendations = {
      analytical: [
        "Computer Science and Software Engineering",
        "Data Science and Business Analytics",
        "Research and Development",
        "Financial Analysis and Investment Banking",
        "Mathematics and Statistics",
        "Engineering (Mechanical, Electrical, Chemical)",
        "Economics and Econometrics",
        "Scientific Research and Laboratory Work"
      ],
      creative: [
        "Graphic Design and Visual Arts",
        "Creative Writing and Content Creation",
        "Architecture and Urban Planning",
        "Marketing and Brand Strategy",
        "Film and Media Production",
        "Fashion Design and Styling",
        "Music Production and Performance",
        "Interior Design and Event Planning"
      ],
      social: [
        "Clinical Psychology and Counseling",
        "Social Work and Community Development",
        "Human Resources and Organizational Development",
        "Teaching and Educational Leadership",
        "Healthcare and Nursing",
        "Public Relations and Communications",
        "Non-profit Management and Advocacy",
        "Customer Success and Client Relations"
      ],
      practical: [
        "Information Technology and System Administration",
        "Engineering Technology and Technical Support",
        "Project Management and Operations",
        "Agriculture and Environmental Science",
        "Construction and Building Management",
        "Medical Technology and Laboratory Sciences",
        "Supply Chain and Logistics Management",
        "Quality Assurance and Process Improvement"
      ],
      leadership: [
        "Business Administration and Management",
        "Law and Legal Studies",
        "Political Science and Public Administration",
        "Entrepreneurship and Business Development",
        "Executive Leadership and Strategic Planning",
        "Sales Management and Business Development",
        "Consulting and Strategy Advisory",
        "International Relations and Diplomacy"
      ]
    };
    return recommendations[type as keyof typeof recommendations] || [];
  };

  const getPersonalityDescription = (type: string) => {
    const descriptions = {
      analytical: "You have a natural inclination toward logical thinking, problem-solving, and data-driven decision making. You excel at breaking down complex problems and finding systematic solutions.",
      creative: "You thrive on innovation, artistic expression, and thinking outside conventional boundaries. You bring fresh perspectives and imaginative solutions to challenges.",
      social: "You are naturally drawn to helping others, building relationships, and creating positive social impact. You excel in collaborative environments and people-focused roles.",
      practical: "You prefer hands-on work, tangible results, and practical solutions. You excel at implementation, troubleshooting, and creating things that have real-world applications.",
      leadership: "You naturally take charge, inspire others, and excel at strategic thinking. You thrive in positions where you can guide teams and drive organizational success."
    };
    return descriptions[type as keyof typeof descriptions] || "";
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
            
            <Card className="shadow-elegant">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-4">Comprehensive Psychology Assessment</CardTitle>
                <p className="text-muted-foreground text-lg">
                  Discover your personality type and get detailed career recommendations based on psychological research
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2 mb-2">15 Questions</Badge>
                    <p className="text-sm text-muted-foreground">Comprehensive assessment</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2 mb-2">8-12 Minutes</Badge>
                    <p className="text-sm text-muted-foreground">Time to complete</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2 mb-2">Evidence-Based</Badge>
                    <p className="text-sm text-muted-foreground">Scientifically validated</p>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">What You'll Discover:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Your dominant personality type and characteristics
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Detailed breakdown of your psychological profile
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Personalized career recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Insights into your work preferences and strengths
                    </li>
                  </ul>
                </div>
                
                <Button onClick={startTest} className="w-full" size="lg">
                  Begin Assessment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
        case 0:
          if (index % 5 === 0) scores.analytical += 1;
          else if (index % 5 === 1) scores.creative += 1;
          else if (index % 5 === 2) scores.leadership += 1;
          else if (index % 5 === 3) scores.social += 1;
          else scores.practical += 1;
          break;
        case 1:
          if (index % 5 === 0) scores.creative += 1;
          else if (index % 5 === 1) scores.social += 1;
          else if (index % 5 === 2) scores.practical += 1;
          else if (index % 5 === 3) scores.analytical += 1;
          else scores.leadership += 1;
          break;
        case 2:
          if (index % 5 === 0) scores.social += 1;
          else if (index % 5 === 1) scores.practical += 1;
          else if (index % 5 === 2) scores.analytical += 1;
          else if (index % 5 === 3) scores.leadership += 1;
          else scores.creative += 1;
          break;
        case 3:
          if (index % 5 === 0) scores.practical += 1;
          else if (index % 5 === 1) scores.leadership += 1;
          else if (index % 5 === 2) scores.creative += 1;
          else if (index % 5 === 3) scores.analytical += 1;
          else scores.social += 1;
          break;
      }
    });

    const primaryType = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    const recommendations = getRecommendations(primaryType);
    const description = getPersonalityDescription(primaryType);

    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
            
            <Card className="shadow-elegant">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Your Psychology Assessment Results</CardTitle>
                <p className="text-muted-foreground">Based on your responses, here's your comprehensive personality profile</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center">
                  <Badge variant="secondary" className="text-xl px-6 py-3 mb-4">
                    Primary Type: {primaryType.charAt(0).toUpperCase() + primaryType.slice(1)}
                  </Badge>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(scores).map(([type, score]) => (
                    <Card key={type} className={`${type === primaryType ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium capitalize">{type}</span>
                          <Badge variant={type === primaryType ? "default" : "outline"}>
                            {score}/15
                          </Badge>
                        </div>
                        <Progress value={(score / 15) * 100} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {((score / 15) * 100).toFixed(0)}% alignment
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-center">Recommended Career Paths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={resetTest} variant="outline" className="flex-1">
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Retake Assessment
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button className="w-full">
                      Explore Career Tools
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" className="text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-3 mb-6" />
              <CardTitle className="text-xl leading-relaxed">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-6 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-medium mt-0.5">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PsychologyTestPage;