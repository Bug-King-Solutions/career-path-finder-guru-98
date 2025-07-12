import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Mail, Phone, GraduationCap, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WaitlistFormProps {
  children: React.ReactNode;
}

export const WaitlistForm = ({ children }: WaitlistFormProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentLevel: "",
    location: "",
    interests: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to the Career Guru Waitlist!",
      description: "You'll be among the first to access the app when it launches.",
    });
    setOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      currentLevel: "",
      location: "",
      interests: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            Join Career Guru Waitlist
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="pl-10"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="pl-10"
                placeholder="+234 xxx xxx xxxx"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium">Current Education Level</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Select onValueChange={(value) => handleChange("currentLevel", value)} required>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ss1">SS1 (Senior Secondary 1)</SelectItem>
                  <SelectItem value="ss2">SS2 (Senior Secondary 2)</SelectItem>
                  <SelectItem value="ss3">SS3 (Senior Secondary 3)</SelectItem>
                  <SelectItem value="university-year1">University Year 1</SelectItem>
                  <SelectItem value="university-year2">University Year 2</SelectItem>
                  <SelectItem value="university-year3">University Year 3</SelectItem>
                  <SelectItem value="university-year4">University Year 4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location (City, State)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="pl-10"
                placeholder="e.g., Jos, Plateau State"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests" className="text-sm font-medium">Career Interests (Optional)</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              placeholder="e.g., Medicine, Engineering, Arts..."
            />
          </div>

          <div className="bg-accent/50 p-4 rounded-lg">
            <h4 className="font-semibold text-accent-foreground mb-2">Early Access Benefits:</h4>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Free premium features for 3 months</li>
              <li>• Priority career consultation</li>
              <li>• Exclusive beta testing access</li>
            </ul>
          </div>

          <Button type="submit" className="w-full">
            Join Waitlist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};