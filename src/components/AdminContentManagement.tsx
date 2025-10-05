import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Plus, Trash2 } from 'lucide-react';

interface SiteSetting {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  content: any;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  order_position: number;
}

interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  features: any;
  status: string;
  order_position: number;
}

export const AdminContentManagement = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [settingsData, servicesData, productsData] = await Promise.all([
        supabase.from('site_settings').select('*').order('section'),
        supabase.from('services').select('*').order('order_position'),
        supabase.from('products').select('*').order('order_position')
      ]);

      if (settingsData.data) setSiteSettings(settingsData.data);
      if (servicesData.data) setServices(servicesData.data);
      if (productsData.data) setProducts(productsData.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, section: string, type: 'site_settings' | 'products') => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${section}-${Date.now()}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bugking_images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('bugking_images')
        .getPublicUrl(filePath);

      if (type === 'site_settings') {
        const { error } = await supabase
          .from('site_settings')
          .update({ image_url: publicUrl })
          .eq('section', section);
        if (error) throw error;
      } else if (type === 'products') {
        const { error } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('id', section);
        if (error) throw error;
      }

      toast.success('Image uploaded successfully');
      fetchAllContent();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const updateSiteSetting = async (section: string, updates: Partial<SiteSetting>) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('section', section);

      if (error) throw error;
      toast.success('Updated successfully');
      fetchAllContent();
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Failed to update');
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Service updated');
      fetchAllContent();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Service deleted');
      fetchAllContent();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const addService = async () => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([{
          title: 'New Service',
          description: 'Service description',
          icon: 'Target',
          order_position: services.length
        }]);

      if (error) throw error;
      toast.success('Service added');
      fetchAllContent();
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Product updated');
      fetchAllContent();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const heroSettings = siteSettings.find(s => s.section === 'hero');
  const aboutSettings = siteSettings.find(s => s.section === 'about');
  const contactSettings = siteSettings.find(s => s.section === 'contact');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage all website content from here</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  defaultValue={heroSettings?.title || ''}
                  onBlur={(e) => updateSiteSetting('hero', { title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue={heroSettings?.description || ''}
                  onBlur={(e) => updateSiteSetting('hero', { description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Background Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'hero', 'site_settings');
                  }}
                  disabled={uploading}
                />
                {heroSettings?.image_url && (
                  <img src={heroSettings.image_url} alt="Hero" className="mt-2 h-32 object-cover rounded" />
                )}
              </div>
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
                <Label>Title</Label>
                <Input
                  defaultValue={aboutSettings?.title || ''}
                  onBlur={(e) => updateSiteSetting('about', { title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  defaultValue={aboutSettings?.subtitle || ''}
                  onBlur={(e) => updateSiteSetting('about', { subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue={aboutSettings?.description || ''}
                  onBlur={(e) => updateSiteSetting('about', { description: e.target.value })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manage Services</h3>
            <Button onClick={addService}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{service.title}</CardTitle>
                  <Button variant="destructive" size="sm" onClick={() => deleteService(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    defaultValue={service.title}
                    onBlur={(e) => updateService(service.id, { title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    defaultValue={service.description || ''}
                    onBlur={(e) => updateService(service.id, { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Name (Brain, Target, Users, etc.)</Label>
                  <Input
                    defaultValue={service.icon || ''}
                    onBlur={(e) => updateService(service.id, { icon: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    defaultValue={product.title}
                    onBlur={(e) => updateProduct(product.id, { title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    defaultValue={product.subtitle || ''}
                    onBlur={(e) => updateProduct(product.id, { subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    defaultValue={product.description || ''}
                    onBlur={(e) => updateProduct(product.id, { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="w-full p-2 border rounded"
                    defaultValue={product.status}
                    onChange={(e) => updateProduct(product.id, { status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, product.id, 'products');
                    }}
                    disabled={uploading}
                  />
                  {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  defaultValue={contactSettings?.title || ''}
                  onBlur={(e) => updateSiteSetting('contact', { title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue={contactSettings?.description || ''}
                  onBlur={(e) => updateSiteSetting('contact', { description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
