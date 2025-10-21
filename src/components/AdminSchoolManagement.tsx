import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAllDocuments, createDocument, updateDocument, deleteDocument } from '@/integrations/firebase/utils';
import { COLLECTIONS, School } from '@/integrations/firebase/types';
import { Timestamp } from 'firebase/firestore';

export const AdminSchoolManagement = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    schoolName: '',
    contactEmail: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await getAllDocuments<School>(COLLECTIONS.SCHOOLS);
      if (data) {
        setSchools(data);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.schoolName || !formData.contactEmail) {
      toast.error('School name and contact email are required');
      return;
    }

    try {
      await createDocument(COLLECTIONS.SCHOOLS, {
        userId: '', // Will be set when school admin account is created
        schoolName: formData.schoolName,
        contactEmail: formData.contactEmail,
        phone: formData.phone,
        address: formData.address,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast.success('School created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchSchools();
    } catch (error) {
      console.error('Error creating school:', error);
      toast.error('Failed to create school');
    }
  };

  const handleUpdate = async () => {
    if (!selectedSchool || !formData.schoolName || !formData.contactEmail) {
      toast.error('School name and contact email are required');
      return;
    }

    try {
      await updateDocument(COLLECTIONS.SCHOOLS, selectedSchool.id, {
        schoolName: formData.schoolName,
        contactEmail: formData.contactEmail,
        phone: formData.phone,
        address: formData.address,
        updatedAt: Timestamp.now()
      });

      toast.success('School updated successfully');
      setIsEditDialogOpen(false);
      setSelectedSchool(null);
      resetForm();
      fetchSchools();
    } catch (error) {
      console.error('Error updating school:', error);
      toast.error('Failed to update school');
    }
  };

  const handleDelete = async (school: School) => {
    if (!confirm(`Are you sure you want to delete ${school.schoolName}?`)) {
      return;
    }

    try {
      await deleteDocument(COLLECTIONS.SCHOOLS, school.id);
      toast.success('School deleted successfully');
      fetchSchools();
    } catch (error) {
      console.error('Error deleting school:', error);
      toast.error('Failed to delete school');
    }
  };

  const openEditDialog = (school: School) => {
    setSelectedSchool(school);
    setFormData({
      schoolName: school.schoolName,
      contactEmail: school.contactEmail,
      phone: school.phone || '',
      address: school.address || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      schoolName: '',
      contactEmail: '',
      phone: '',
      address: ''
    });
  };

  const filteredSchools = schools.filter(school =>
    school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading schools...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>School Management</CardTitle>
                <p className="text-sm text-muted-foreground">Manage educational institutions</p>
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredSchools.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.schoolName}</TableCell>
                    <TableCell>{school.contactEmail}</TableCell>
                    <TableCell>{school.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {school.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(school)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(school)}
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
              {searchQuery ? 'No schools found matching your search' : 'No schools yet. Create one to get started.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="schoolName">School Name *</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                placeholder="Enter school name"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@school.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="School address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create School</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-schoolName">School Name *</Label>
              <Input
                id="edit-schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                placeholder="Enter school name"
              />
            </div>
            <div>
              <Label htmlFor="edit-contactEmail">Contact Email *</Label>
              <Input
                id="edit-contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@school.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="School address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedSchool(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update School</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
