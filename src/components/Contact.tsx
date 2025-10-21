import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { createDocument } from "@/integrations/firebase/utils";
import { COLLECTIONS } from "@/integrations/firebase/types";
import { Timestamp } from "firebase/firestore";

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await createDocument(COLLECTIONS.CONTACT_SUBMISSIONS, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: formData.phone,
        projectType: formData.subject,
        message: formData.message,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your career journey? Contact Mindscope Academy today for professional guidance and support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Location</h3>
                    <p className="text-muted-foreground">
                      Jos, Plateau State<br />
                      Nigeria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Phone</h3>
                    <p className="text-muted-foreground">
                      +234 (0) 123 456 7890<br />
                      +234 (0) 987 654 3210
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      info@mindscopeacademy.com<br />
                      paul@mindscopeacademy.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Send Us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <Input 
                        placeholder="Enter your first name" 
                        className="w-full"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <Input 
                        placeholder="Enter your last name" 
                        className="w-full"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        className="w-full"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input 
                      placeholder="What would you like to discuss?" 
                      className="w-full"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Tell us more about your career goals and how we can help..."
                      className="w-full min-h-[120px]"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full text-lg"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 w-5 h-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300 group">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-2">Quick Chat</h3>
              <p className="text-muted-foreground mb-4">
                Get instant answers to your career questions
              </p>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300 group">
            <CardContent className="p-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-2">Book Appointment</h3>
              <p className="text-muted-foreground mb-4">
                Schedule a one-on-one consultation session
              </p>
              <Button variant="secondary" className="w-full">
                Book Now
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card hover:shadow-elegant transition-all duration-300 group">
            <CardContent className="p-8">
              <Building className="w-12 h-12 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-foreground mb-2">Visit Office</h3>
              <p className="text-muted-foreground mb-4">
                Come to our Jos office for in-person guidance
              </p>
              <Button variant="accent" className="w-full">
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};