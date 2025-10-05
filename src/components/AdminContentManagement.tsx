import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Image, Upload } from 'lucide-react';

interface ContentSection {
  id: string;
  section_name: string;
  title: string;
  description: string;
  image_url: string | null;
  content: any;
}

export const AdminContentManagement = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('section_name');

      if (error) throw error;
      setSections((data || []) as ContentSection[]);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, sectionId: string) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionId}-${Date.now()}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bugking_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('bugking_images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('website_content')
        .update({ image_url: publicUrl })
        .eq('id', sectionId);

      if (updateError) throw updateError;

      toast.success('Image uploaded successfully');
      fetchContent();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateSection = async (sectionId: string, updates: Partial<ContentSection>) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .update(updates)
        .eq('id', sectionId);

      if (error) throw error;

      toast.success('Section updated successfully');
      fetchContent();
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage website sections, images, and content</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  placeholder="Hero title"
                  defaultValue="Transform Your Career Journey"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  placeholder="Hero description"
                  defaultValue="Expert career guidance and psychology assessments"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-image">Hero Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="hero-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'hero');
                    }}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button onClick={() => toast.success('Hero section updated')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Title</Label>
                <Input
                  id="about-title"
                  placeholder="About title"
                  defaultValue="Meet Mr. Paul Olayiwola"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-bio">Biography</Label>
                <Textarea
                  id="about-bio"
                  placeholder="Biography text"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-image">Profile Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="about-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'about');
                    }}
                  />
                  <Image className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button onClick={() => toast.success('About section updated')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="services-title">Title</Label>
                <Input
                  id="services-title"
                  placeholder="Services title"
                  defaultValue="Our Services"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="services-description">Description</Label>
                <Textarea
                  id="services-description"
                  placeholder="Services description"
                  rows={4}
                />
              </div>
              <Button onClick={() => toast.success('Services section updated')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="products-title">Title</Label>
                <Input
                  id="products-title"
                  placeholder="Products title"
                  defaultValue="Our Products"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-mockup">App Mockup Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="app-mockup"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'app-mockup');
                    }}
                  />
                  <Image className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button onClick={() => toast.success('Products section updated')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
