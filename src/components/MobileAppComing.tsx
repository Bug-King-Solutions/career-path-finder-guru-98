import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, Bell, Star, Users, Zap } from "lucide-react";

export const MobileAppComing = () => {
  return (
    <section id="mobile-app" className="py-20 bg-gradient-to-br from-accent-light to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
            Coming Soon
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Career Guru Mobile App
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take your career exploration journey wherever you go. Our mobile app brings 
            personalized career guidance, psychology tests, and university recommendations 
            right to your fingertips.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - App mockup and features */}
          <div className="space-y-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white shadow-elegant">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <Smartphone className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  Native Mobile Experience
                </h3>
                <p className="text-white/90 text-center">
                  Optimized for iOS and Android with offline capabilities, 
                  push notifications, and seamless sync across devices.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Lightning Fast</h4>
                      <p className="text-xs text-muted-foreground">Quick assessments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary/10 rounded-lg p-2">
                      <Bell className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Smart Reminders</h4>
                      <p className="text-xs text-muted-foreground">Stay on track</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Peer Network</h4>
                      <p className="text-xs text-muted-foreground">Connect & share</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary/10 rounded-lg p-2">
                      <Star className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Progress Tracking</h4>
                      <p className="text-xs text-muted-foreground">Monitor growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right side - Store badges and signup */}
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Be the First to Know
              </h3>
              <p className="text-muted-foreground">
                Sign up for early access and get notified when Career Guru 
                launches on iOS and Android app stores.
              </p>

              {/* Coming Soon Store Badges */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="relative">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="Download on the App Store"
                      className="h-14 opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-tertiary">Coming Soon</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Get it on Google Play"
                      className="h-14 opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-tertiary">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email signup for early access */}
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-center">Get Early Access</h4>
                    <div className="flex space-x-2">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Button size="sm" className="px-4">
                        <Bell className="w-4 h-4 mr-2" />
                        Notify Me
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Join 1,000+ students already on the waitlist
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key features preview */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
              <h4 className="font-semibold mb-4 text-center">What to Expect</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Comprehensive personality assessments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm">AI-powered career recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">University and scholarship finder</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm">Progress tracking and goal setting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Offline mode for assessments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Meanwhile, explore Career Guru on the web
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Download className="w-5 h-5 mr-2" />
            Try Web Version Now
          </Button>
        </div>
      </div>
    </section>
  );
};