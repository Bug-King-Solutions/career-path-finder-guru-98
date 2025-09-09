import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import SchoolDashboard from './SchoolDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardPage = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'student':
      return <StudentDashboard />;
    case 'school':
      return <SchoolDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
            <p className="text-muted-foreground">
              Your dashboard is being prepared...
            </p>
          </div>
        </div>
      );
  }
};

export default DashboardPage;