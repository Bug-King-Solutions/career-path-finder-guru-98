import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StudentManagementProps {
  schoolId: string;
  students: any[];
  onStudentUpdate: () => void;
}

export const StudentManagement = ({ schoolId, students, onStudentUpdate }: StudentManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This component needs to be updated to use Firebase. Please refer to FIREBASE_MIGRATION_README.md for migration instructions.
          </AlertDescription>
        </Alert>
        <p className="mt-4 text-muted-foreground">
          Student management features will be available after Firebase migration is complete.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Current school has {students.length} students enrolled.
        </p>
      </CardContent>
    </Card>
  );
};
