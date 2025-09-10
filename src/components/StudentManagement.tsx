import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentManagementProps {
  schoolId: string;
  students: any[];
  onStudentUpdate: () => void;
}

export const StudentManagement = ({ schoolId, students, onStudentUpdate }: StudentManagementProps) => {
  const { toast } = useToast();
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [passwordChange, setPasswordChange] = useState({
    studentId: '',
    newPassword: ''
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createStudent = async () => {
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: newStudent.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: newStudent.firstName,
            last_name: newStudent.lastName
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create student profile
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            first_name: newStudent.firstName,
            last_name: newStudent.lastName,
            email: newStudent.email,
            school_id: schoolId
          });

        if (studentError) throw studentError;

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'student'
          });

        if (roleError) throw roleError;

        toast({
          title: "Success",
          description: "Student created successfully"
        });

        setNewStudent({ firstName: '', lastName: '', email: '', password: '' });
        setIsCreateDialogOpen(false);
        onStudentUpdate();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create student",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: string, userId: string) => {
    setLoading(true);
    try {
      // Delete student profile (this will cascade to related data)
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (studentError) throw studentError;

      // Delete user from auth (admin operation)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.warn('Could not delete auth user:', authError);
        // Continue even if auth deletion fails
      }

      toast({
        title: "Success",
        description: "Student deleted successfully"
      });

      onStudentUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete student",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!passwordChange.newPassword || passwordChange.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const student = students.find(s => s.id === passwordChange.studentId);
      if (!student) throw new Error('Student not found');

      // Update password (admin operation)
      const { error } = await supabase.auth.admin.updateUserById(student.user_id, {
        password: passwordChange.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully"
      });

      setPasswordChange({ studentId: '', newPassword: '' });
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Management</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Student</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createStudent} disabled={loading}>
                {loading ? 'Creating...' : 'Create Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex gap-2 mt-2">
                    {student.test_completed && (
                      <Badge variant="default">Test Complete</Badge>
                    )}
                    <Badge variant="outline">
                      Joined: {new Date(student.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isPasswordDialogOpen && passwordChange.studentId === student.id} onOpenChange={(open) => {
                    setIsPasswordDialogOpen(open);
                    if (!open) setPasswordChange({ studentId: '', newPassword: '' });
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPasswordChange({ studentId: student.id, newPassword: '' })}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label>Student: {student.first_name} {student.last_name}</Label>
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordChange.newPassword}
                            onChange={(e) => setPasswordChange(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={changePassword} disabled={loading}>
                          {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {student.first_name} {student.last_name}? 
                          This will permanently delete their profile, test results, and all associated data.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteStudent(student.id, student.user_id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Student
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No students registered yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};