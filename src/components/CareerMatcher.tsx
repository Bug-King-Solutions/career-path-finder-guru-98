import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Briefcase, DollarSign, TrendingUp, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

interface Career {
  id: number;
  title: string;
  description: string;
  averageSalary: string;
  growthRate: string;
  skillsRequired: string[];
  education: string;
  workEnvironment: string;
  jobOutlook: string;
  personalityFit: string[];
  topEmployers: string[];
  matchScore?: number;
}

const careers: Career[] = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Design, develop, and maintain software applications and systems using various programming languages and technologies.",
    averageSalary: "₦2,400,000 - ₦8,400,000",
    growthRate: "22%",
    skillsRequired: ["Programming", "Problem Solving", "Algorithms", "Software Architecture", "Testing"],
    education: "Bachelor's in Computer Science or related field",
    workEnvironment: "Office/Remote",
    jobOutlook: "Excellent",
    personalityFit: ["Analytical", "Creative", "Detail-oriented"],
    topEmployers: ["Andela", "Interswitch", "Flutterwave", "Paystack", "Microsoft Nigeria"]
  },
  {
    id: 2,
    title: "Medical Doctor",
    description: "Diagnose and treat illnesses, injuries, and health conditions to improve patient health and wellbeing.",
    averageSalary: "₦3,600,000 - ₦12,000,000",
    growthRate: "15%",
    skillsRequired: ["Medical Knowledge", "Communication", "Empathy", "Critical Thinking", "Manual Dexterity"],
    education: "Medical Degree (MBBS) + Residency",
    workEnvironment: "Hospitals/Clinics",
    jobOutlook: "Excellent",
    personalityFit: ["Social", "Analytical", "Caring"],
    topEmployers: ["Lagos University Teaching Hospital", "University College Hospital", "National Hospital Abuja"]
  },
  {
    id: 3,
    title: "Data Scientist",
    description: "Analyze complex data to extract insights and support business decision-making using statistical methods and machine learning.",
    averageSalary: "₦2,100,000 - ₦7,200,000",
    growthRate: "35%",
    skillsRequired: ["Statistics", "Python/R", "Machine Learning", "Data Visualization", "Business Intelligence"],
    education: "Bachelor's in Statistics, Mathematics, or Computer Science",
    workEnvironment: "Office/Remote",
    jobOutlook: "Excellent",
    personalityFit: ["Analytical", "Creative", "Detail-oriented"],
    topEmployers: ["MTN Nigeria", "Jumia", "Konga", "Nigerian Banks", "Oil & Gas Companies"]
  },
  {
    id: 4,
    title: "Civil Engineer",
    description: "Design, build, and maintain infrastructure projects including roads, bridges, buildings, and water systems.",
    averageSalary: "₦1,800,000 - ₦6,000,000",
    growthRate: "8%",
    skillsRequired: ["Engineering Design", "Project Management", "AutoCAD", "Mathematics", "Problem Solving"],
    education: "Bachelor's in Civil Engineering",
    workEnvironment: "Office/Field",
    jobOutlook: "Good",
    personalityFit: ["Practical", "Analytical", "Leadership"],
    topEmployers: ["Julius Berger", "RCC", "CCECC", "Arab Contractors", "Dangote Group"]
  },
  {
    id: 5,
    title: "Digital Marketing Specialist",
    description: "Develop and execute digital marketing strategies to promote brands and products across online platforms.",
    averageSalary: "₦1,200,000 - ₦4,800,000",
    growthRate: "28%",
    skillsRequired: ["SEO/SEM", "Social Media", "Content Creation", "Analytics", "Creativity"],
    education: "Bachelor's in Marketing, Communications, or related field",
    workEnvironment: "Office/Remote",
    jobOutlook: "Excellent",
    personalityFit: ["Creative", "Social", "Analytical"],
    topEmployers: ["Alder Consulting", "X3M Ideas", "Insight Publicis", "Noah's Ark", "Red Media"]
  },
  {
    id: 6,
    title: "Financial Analyst",
    description: "Analyze financial data and market trends to guide investment decisions and business strategies.",
    averageSalary: "₦1,800,000 - ₦5,400,000",
    growthRate: "12%",
    skillsRequired: ["Financial Modeling", "Excel", "Market Analysis", "Risk Assessment", "Communication"],
    education: "Bachelor's in Finance, Economics, or Accounting",
    workEnvironment: "Office",
    jobOutlook: "Good",
    personalityFit: ["Analytical", "Detail-oriented", "Leadership"],
    topEmployers: ["First Bank", "GTBank", "Access Bank", "UBA", "Investment Banks"]
  }
];

export const CareerMatcher = () => {
  const [personalityType, setPersonalityType] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [matchedCareers, setMatchedCareers] = useState<Career[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleMatch = () => {
    if (!personalityType || !interests) {
      toast.error("Please fill in your personality type and interests");
      return;
    }

    // Simple matching algorithm based on personality and interests
    const scored = careers.map(career => {
      let score = 0;
      
      // Personality matching
      if (career.personalityFit.some(fit => 
        fit.toLowerCase().includes(personalityType.toLowerCase())
      )) {
        score += 30;
      }

      // Interest matching
      const interestWords = interests.toLowerCase().split(' ');
      const careerText = (career.title + ' ' + career.description + ' ' + career.skillsRequired.join(' ')).toLowerCase();
      interestWords.forEach(word => {
        if (word.length > 3 && careerText.includes(word)) {
          score += 15;
        }
      });

      // Skills matching
      if (skills) {
        const skillWords = skills.toLowerCase().split(' ');
        const careerSkills = career.skillsRequired.join(' ').toLowerCase();
        skillWords.forEach(skill => {
          if (skill.length > 3 && careerSkills.includes(skill)) {
            score += 20;
          }
        });
      }

      return { ...career, matchScore: Math.min(100, score) };
    });

    const sorted = scored
      .filter(career => career.matchScore && career.matchScore > 20)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 4);

    setMatchedCareers(sorted);
    setShowResults(true);
    toast.success(`Found ${sorted.length} career matches for you!`);
  };

  const resetMatcher = () => {
    setPersonalityType("");
    setInterests("");
    setSkills("");
    setEducation("");
    setMatchedCareers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Career Matches</CardTitle>
            <p className="text-muted-foreground">
              Based on your profile, here are the best career matches for you
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={resetMatcher} variant="outline" className="mb-6">
              Start New Match
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matchedCareers.map(career => (
            <Card key={career.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{career.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-sm">
                        {career.matchScore}% Match
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor((career.matchScore || 0) / 20)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {career.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Salary Range</div>
                      <div className="text-sm font-medium">{career.averageSalary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Growth Rate</div>
                      <div className="text-sm font-medium">{career.growthRate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Environment</div>
                      <div className="text-sm font-medium">{career.workEnvironment}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Job Outlook</div>
                      <div className="text-sm font-medium">{career.jobOutlook}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.skillsRequired.map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Top Employers:</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.topEmployers.slice(0, 3).map(employer => (
                      <Badge key={employer} variant="secondary" className="text-xs">
                        {employer}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">Education Required:</h4>
                  <p className="text-sm text-muted-foreground">{career.education}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {matchedCareers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No strong matches found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your profile information for better matches
              </p>
              <Button onClick={resetMatcher}>Try Again</Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-elegant">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Career Matcher</CardTitle>
        <p className="text-muted-foreground">
          Find careers that match your personality, interests, and skills
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Personality Type <span className="text-red-500">*</span>
            </label>
            <Select value={personalityType} onValueChange={setPersonalityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select your primary personality type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analytical">Analytical - I love solving problems and analyzing data</SelectItem>
                <SelectItem value="creative">Creative - I enjoy expressing ideas and creating new things</SelectItem>
                <SelectItem value="social">Social - I prefer working with and helping people</SelectItem>
                <SelectItem value="practical">Practical - I like hands-on work and seeing tangible results</SelectItem>
                <SelectItem value="leadership">Leadership - I enjoy leading teams and making decisions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Interests & Passions <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe what you're passionate about, your hobbies, and what excites you..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Current Skills</label>
            <Input
              placeholder="List your current skills (e.g., programming, communication, design...)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Education Level</label>
            <Select value={education} onValueChange={setEducation}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current or planned education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary/High School</SelectItem>
                <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD/Doctorate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleMatch} className="w-full" size="lg">
          <Users className="mr-2 w-4 h-4" />
          Find My Career Matches
        </Button>
      </CardContent>
    </Card>
  );
};