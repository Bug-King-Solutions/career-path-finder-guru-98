import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const AdminStudentManagement = () => {
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
      </CardContent>
    </Card>
  );
};
