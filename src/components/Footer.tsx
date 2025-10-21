import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { createDocument } from "@/integrations/firebase/utils";
import { COLLECTIONS } from "@/integrations/firebase/types";
import { Timestamp } from "firebase/firestore";

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsSubscribing(true);
      await createDocument(COLLECTIONS.NEWSLETTER_SUBSCRIPTIONS, {
        email: email,
        status: 'active',
        subscribedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Mindscope Academy</h3>
                <p className="text-xs text-primary-foreground/80">Career Guidance & Psychology</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Empowering Nigerian students to discover their perfect career paths through 
              professional psychology and expert guidance.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Mr. Paul</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#app" className="hover:text-white transition-colors">Career Guru App</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Psychology Assessment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Consultation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Course Selection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">University Matching</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Group Workshops</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Life Purpose Discovery</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Stay Updated</h4>
            <p className="text-primary-foreground/80 mb-4">
              Subscribe to our newsletter for career tips, university updates, and exclusive content.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                variant="accent" 
                className="w-full"
                type="submit"
                disabled={isSubscribing}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-xs text-primary-foreground/60 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="w-5 h-5 text-accent-light" />
              <span className="text-primary-foreground/80">Jos, Plateau State, Nigeria</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="w-5 h-5 text-accent-light" />
              <span className="text-primary-foreground/80">+234 (0) 123 456 7890</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="w-5 h-5 text-accent-light" />
              <span className="text-primary-foreground/80">info@mindscopeacademy.com</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/80 text-sm mb-4 md:mb-0">
            © 2024 Mindscope Academy. All rights reserved. Built with care in Nigeria.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};