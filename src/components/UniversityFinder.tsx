import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, GraduationCap, Search, ExternalLink, Star } from "lucide-react";

interface University {
  id: number;
  name: string;
  location: string;
  state: string;
  type: 'Federal' | 'State' | 'Private';
  established: number;
  rating: number;
  programs: string[];
  website: string;
  description: string;
  tuition: string;
  admission: string;
}

const universities: University[] = [
  {
    id: 1,
    name: "University of Ibadan",
    location: "Ibadan",
    state: "Oyo",
    type: "Federal",
    established: 1948,
    rating: 4.8,
    programs: ["Medicine", "Engineering", "Law", "Arts", "Science", "Business"],
    website: "www.ui.edu.ng",
    description: "Nigeria's first university and a leading institution in Africa for academic excellence and research.",
    tuition: "₦45,000 - ₦120,000",
    admission: "JAMB UTME + Post-UTME"
  },
  {
    id: 2,
    name: "University of Lagos",
    location: "Lagos",
    state: "Lagos",
    type: "Federal",
    established: 1962,
    rating: 4.7,
    programs: ["Engineering", "Medicine", "Law", "Business", "Arts", "Science"],
    website: "www.unilag.edu.ng",
    description: "A leading university known for its academic excellence and beautiful island campus.",
    tuition: "₦50,000 - ₦150,000",
    admission: "JAMB UTME + Post-UTME"
  },
  {
    id: 3,
    name: "Ahmadu Bello University",
    location: "Zaria",
    state: "Kaduna",
    type: "Federal",
    established: 1962,
    rating: 4.6,
    programs: ["Agriculture", "Engineering", "Medicine", "Veterinary", "Arts", "Science"],
    website: "www.abu.edu.ng",
    description: "One of Nigeria's largest universities with strong programs in agriculture and engineering.",
    tuition: "₦40,000 - ₦110,000",
    admission: "JAMB UTME + Post-UTME"
  },
  {
    id: 4,
    name: "Covenant University",
    location: "Ota",
    state: "Ogun",
    type: "Private",
    established: 2002,
    rating: 4.9,
    programs: ["Engineering", "Business", "Sciences", "Computing", "Architecture"],
    website: "www.covenantuniversity.edu.ng",
    description: "Premier private university known for innovation, technology, and entrepreneurship.",
    tuition: "₦1,500,000 - ₦2,500,000",
    admission: "JAMB UTME + Covenant University Admission Test"
  },
  {
    id: 5,
    name: "University of Jos",
    location: "Jos",
    state: "Plateau",
    type: "Federal",
    established: 1975,
    rating: 4.4,
    programs: ["Medicine", "Arts", "Science", "Education", "Pharmacy"],
    website: "www.unijos.edu.ng",
    description: "Known for its peaceful environment and strong academic programs in health sciences.",
    tuition: "₦45,000 - ₦125,000",
    admission: "JAMB UTME + Post-UTME"
  },
  {
    id: 6,
    name: "Obafemi Awolowo University",
    location: "Ile-Ife",
    state: "Osun",
    type: "Federal",
    established: 1961,
    rating: 4.7,
    programs: ["Medicine", "Engineering", "Law", "Pharmacy", "Arts", "Science"],
    website: "www.oauife.edu.ng",
    description: "Famous for its beautiful campus and excellent academic programs.",
    tuition: "₦48,000 - ₦130,000",
    admission: "JAMB UTME + Post-UTME"
  }
];

export const UniversityFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all-states");
  const [selectedType, setSelectedType] = useState("all-types");
  const [selectedProgram, setSelectedProgram] = useState("all-programs");

  const states = [...new Set(universities.map(uni => uni.state))].sort();
  const types = [...new Set(universities.map(uni => uni.type))];
  const allPrograms = [...new Set(universities.flatMap(uni => uni.programs))].sort();

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !selectedState || selectedState === "all-states" || uni.state === selectedState;
    const matchesType = !selectedType || selectedType === "all-types" || uni.type === selectedType;
    const matchesProgram = !selectedProgram || selectedProgram === "all-programs" || uni.programs.includes(selectedProgram);

    return matchesSearch && matchesState && matchesType && matchesProgram;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("all-states");
    setSelectedType("all-types");
    setSelectedProgram("all-programs");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            University Finder
          </CardTitle>
          <p className="text-muted-foreground">
            Find the perfect university for your academic journey in Nigeria
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-states">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="University Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Program/Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-programs">All Programs</SelectItem>
                {allPrograms.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Found {filteredUniversities.length} universities
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUniversities.map(uni => (
          <Card key={uni.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{uni.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{uni.location}, {uni.state}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{uni.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={uni.type === 'Federal' ? 'default' : uni.type === 'State' ? 'secondary' : 'outline'}>
                  {uni.type}
                </Badge>
                <Badge variant="outline">Est. {uni.established}</Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {uni.description}
              </p>

              <div>
                <h4 className="text-sm font-semibold mb-2">Available Programs:</h4>
                <div className="flex flex-wrap gap-1">
                  {uni.programs.slice(0, 4).map(program => (
                    <Badge key={program} variant="secondary" className="text-xs">
                      {program}
                    </Badge>
                  ))}
                  {uni.programs.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{uni.programs.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tuition:</span>
                  <p className="text-muted-foreground">{uni.tuition}</p>
                </div>
                <div>
                  <span className="font-medium">Admission:</span>
                  <p className="text-muted-foreground">{uni.admission}</p>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No universities found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};