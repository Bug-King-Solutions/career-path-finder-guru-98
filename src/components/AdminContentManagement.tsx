import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Briefcase, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getAllDocuments, createDocument, updateDocument, deleteDocument } from '@/integrations/firebase/utils';
import { COLLECTIONS, Product, Service } from '@/integrations/firebase/types';
import { Timestamp } from 'firebase/firestore';

export const AdminContentManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  
  // Product dialogs
  const [isProductCreateOpen, setIsProductCreateOpen] = useState(false);
  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    features: ''
  });

  // Service dialogs
  const [isServiceCreateOpen, setIsServiceCreateOpen] = useState(false);
  const [isServiceEditOpen, setIsServiceEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, servicesData] = await Promise.all([
        getAllDocuments<Product>(COLLECTIONS.PRODUCTS),
        getAllDocuments<Service>(COLLECTIONS.SERVICES)
      ]);

      if (productsData) setProducts(productsData);
      if (servicesData) setServices(servicesData);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  // Product handlers
  const handleCreateProduct = async () => {
    if (!productForm.title) {
      toast.error('Product title is required');
      return;
    }

    try {
      await createDocument(COLLECTIONS.PRODUCTS, {
        title: productForm.title,
        subtitle: productForm.subtitle,
        description: productForm.description,
        imageUrl: productForm.imageUrl,
        features: productForm.features ? JSON.parse(productForm.features) : [],
        orderPosition: products.length + 1,
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success('Product created successfully');
      setIsProductCreateOpen(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !productForm.title) {
      toast.error('Product title is required');
      return;
    }

    try {
      await updateDocument(COLLECTIONS.PRODUCTS, selectedProduct.id, {
        title: productForm.title,
        subtitle: productForm.subtitle,
        description: productForm.description,
        imageUrl: productForm.imageUrl,
        features: productForm.features ? JSON.parse(productForm.features) : [],
        updatedAt: Timestamp.now()
      });

      toast.success('Product updated successfully');
      setIsProductEditOpen(false);
      setSelectedProduct(null);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.title}?`)) return;

    try {
      await deleteDocument(COLLECTIONS.PRODUCTS, product.id);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const openProductEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      title: product.title,
      subtitle: product.subtitle || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      features: Array.isArray(product.features) ? JSON.stringify(product.features, null, 2) : ''
    });
    setIsProductEditOpen(true);
  };

  const resetProductForm = () => {
    setProductForm({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      features: ''
    });
  };

  // Service handlers
  const handleCreateService = async () => {
    if (!serviceForm.title) {
      toast.error('Service title is required');
      return;
    }

    try {
      await createDocument(COLLECTIONS.SERVICES, {
        title: serviceForm.title,
        description: serviceForm.description,
        icon: serviceForm.icon,
        orderPosition: services.length + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success('Service created successfully');
      setIsServiceCreateOpen(false);
      resetServiceForm();
      fetchData();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService || !serviceForm.title) {
      toast.error('Service title is required');
      return;
    }

    try {
      await updateDocument(COLLECTIONS.SERVICES, selectedService.id, {
        title: serviceForm.title,
        description: serviceForm.description,
        icon: serviceForm.icon,
        updatedAt: Timestamp.now()
      });

      toast.success('Service updated successfully');
      setIsServiceEditOpen(false);
      setSelectedService(null);
      resetServiceForm();
      fetchData();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete ${service.title}?`)) return;

    try {
      await deleteDocument(COLLECTIONS.SERVICES, service.id);
      toast.success('Service deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const openServiceEditDialog = (service: Service) => {
    setSelectedService(service);
    setServiceForm({
      title: service.title,
      description: service.description || '',
      icon: service.icon || ''
    });
    setIsServiceEditOpen(true);
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      description: '',
      icon: ''
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <p className="text-sm text-muted-foreground">Manage products and services displayed on the website</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">
                <Package className="w-4 h-4 mr-2" />
                Products ({products.length})
              </TabsTrigger>
              <TabsTrigger value="services">
                <Briefcase className="w-4 h-4 mr-2" />
                Services ({services.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsProductCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subtitle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>{product.subtitle || 'N/A'}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {product.status || 'active'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openProductEditDialog(product)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No products yet. Create one to get started.
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsServiceCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {services.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell className="max-w-md truncate">{service.description || 'N/A'}</TableCell>
                        <TableCell>{service.icon || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openServiceEditDialog(service)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService(service)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No services yet. Create one to get started.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Product Create Dialog */}
      <Dialog open={isProductCreateOpen} onOpenChange={setIsProductCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="p-title">Title *</Label>
              <Input
                id="p-title"
                value={productForm.title}
                onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Product title"
              />
            </div>
            <div>
              <Label htmlFor="p-subtitle">Subtitle</Label>
              <Input
                id="p-subtitle"
                value={productForm.subtitle}
                onChange={(e) => setProductForm(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Product subtitle"
              />
            </div>
            <div>
              <Label htmlFor="p-description">Description</Label>
              <Textarea
                id="p-description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="p-image">Image URL</Label>
              <Input
                id="p-image"
                value={productForm.imageUrl}
                onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="p-features">Features (JSON Array)</Label>
              <Textarea
                id="p-features"
                value={productForm.features}
                onChange={(e) => setProductForm(prev => ({ ...prev, features: e.target.value }))}
                placeholder='["Feature 1", "Feature 2"]'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsProductCreateOpen(false); resetProductForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Edit Dialog */}
      <Dialog open={isProductEditOpen} onOpenChange={setIsProductEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="ep-title">Title *</Label>
              <Input
                id="ep-title"
                value={productForm.title}
                onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Product title"
              />
            </div>
            <div>
              <Label htmlFor="ep-subtitle">Subtitle</Label>
              <Input
                id="ep-subtitle"
                value={productForm.subtitle}
                onChange={(e) => setProductForm(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Product subtitle"
              />
            </div>
            <div>
              <Label htmlFor="ep-description">Description</Label>
              <Textarea
                id="ep-description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="ep-image">Image URL</Label>
              <Input
                id="ep-image"
                value={productForm.imageUrl}
                onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="ep-features">Features (JSON Array)</Label>
              <Textarea
                id="ep-features"
                value={productForm.features}
                onChange={(e) => setProductForm(prev => ({ ...prev, features: e.target.value }))}
                placeholder='["Feature 1", "Feature 2"]'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsProductEditOpen(false); setSelectedProduct(null); resetProductForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Create Dialog */}
      <Dialog open={isServiceCreateOpen} onOpenChange={setIsServiceCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="s-title">Title *</Label>
              <Input
                id="s-title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Service title"
              />
            </div>
            <div>
              <Label htmlFor="s-description">Description</Label>
              <Textarea
                id="s-description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Service description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="s-icon">Icon Name (Lucide React)</Label>
              <Input
                id="s-icon"
                value={serviceForm.icon}
                onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., Brain, Target, Users"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsServiceCreateOpen(false); resetServiceForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateService}>Create Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Edit Dialog */}
      <Dialog open={isServiceEditOpen} onOpenChange={setIsServiceEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="es-title">Title *</Label>
              <Input
                id="es-title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Service title"
              />
            </div>
            <div>
              <Label htmlFor="es-description">Description</Label>
              <Textarea
                id="es-description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Service description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="es-icon">Icon Name (Lucide React)</Label>
              <Input
                id="es-icon"
                value={serviceForm.icon}
                onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., Brain, Target, Users"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsServiceEditOpen(false); setSelectedService(null); resetServiceForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateService}>Update Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
