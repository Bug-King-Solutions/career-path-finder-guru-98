import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Building, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface School {
  id: string;
  school_name: string;
  contact_email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export const AdminSchoolManagement = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newSchool, setNewSchool] = useState({
    schoolName: '',
    contactEmail: '',
    phone: '',
    address: '',
    adminEmail: '',
    adminPassword: ''
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async () => {
    if (!newSchool.schoolName || !newSchool.contactEmail || !newSchool.adminEmail || !newSchool.adminPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCreateLoading(true);
    try {
      // Create auth user for the school
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newSchool.adminEmail,
        password: newSchool.adminPassword,
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'school'
          });

        if (roleError) throw roleError;

        // Create school profile
        const { error: schoolError } = await supabase
          .from('schools')
          .insert({
            user_id: authData.user.id,
            school_name: newSchool.schoolName,
            contact_email: newSchool.contactEmail,
            phone: newSchool.phone || null,
            address: newSchool.address || null
          });

        if (schoolError) throw schoolError;

        toast({
          title: "Success",
          description: "School created successfully",
        });

        setNewSchool({
          schoolName: '',
          contactEmail: '',
          phone: '',
          address: '',
          adminEmail: '',
          adminPassword: ''
        });
        setIsCreateDialogOpen(false);
        fetchSchools();
      }
    } catch (error) {
      console.error('Error creating school:', error);
      toast({
        title: "Error",
        description: "Failed to create school",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "School deleted successfully",
      });
      fetchSchools();
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">School Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add School
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Card key={school.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {school.school_name}
                </CardTitle>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete School</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{school.school_name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteSchool(school.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {school.contact_email}
              </div>
              {school.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {school.phone}
                </div>
              )}
              {school.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {school.address}
                </div>
              )}
              <div className="pt-2">
                <Badge variant="outline">
                  Created: {new Date(school.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {schools.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No schools found. Create your first school to get started.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school-name">School Name *</Label>
              <Input
                id="school-name"
                value={newSchool.schoolName}
                onChange={(e) => setNewSchool(prev => ({ ...prev, schoolName: e.target.value }))}
                placeholder="Enter school name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email *</Label>
              <Input
                id="contact-email"
                type="email"
                value={newSchool.contactEmail}
                onChange={(e) => setNewSchool(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="Enter contact email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newSchool.phone}
                onChange={(e) => setNewSchool(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newSchool.address}
                onChange={(e) => setNewSchool(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter school address"
              />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">Admin Account Details</p>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={newSchool.adminEmail}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, adminEmail: e.target.value }))}
                  placeholder="Enter admin email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password *</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={newSchool.adminPassword}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, adminPassword: e.target.value }))}
                  placeholder="Enter admin password"
                  minLength={6}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSchool} disabled={createLoading}>
              {createLoading ? "Creating..." : "Create School"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};