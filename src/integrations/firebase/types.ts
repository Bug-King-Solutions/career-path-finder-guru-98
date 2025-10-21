import { Timestamp } from 'firebase/firestore';

// User Roles
export type AppRole = 'admin' | 'moderator' | 'user' | 'student' | 'school';

// Collection Types
export interface UserRole {
  id: string;
  userId: string;
  role: AppRole;
  createdAt: Timestamp;
}

export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  schoolId?: string;
  studentNumber?: string;
  educationLevel?: string;
  interests?: string[];
  skills?: string[];
  personalityType?: string;
  testCompleted?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface School {
  id: string;
  userId: string;
  schoolName: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SchoolOption {
  id: string;
  schoolName: string;
  schoolType: string;
  location: string;
  createdAt?: Timestamp;
}

export interface StudentTestResult {
  id: string;
  studentId: string;
  testType: string;
  personalityType?: string;
  scores?: Record<string, any>;
  recommendations?: string[];
  completedAt: Timestamp;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  courseField: string;
  progressPercentage?: number;
  universitiesExplored?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Booking {
  id: string;
  bookingType: string;
  studentId?: string;
  schoolId?: string;
  bookingDate?: Timestamp;
  status?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budgetRange?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  status: string;
  subscribedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  features?: any;
  orderPosition?: number;
  status?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  orderPosition?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SiteSetting {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  content?: any;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SchoolEvaluationQuestion {
  id: string;
  schoolId?: string;
  questionText: string;
  questionType: string;
  section: string;
  options?: any;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StudentCustomAnswer {
  id: string;
  studentId: string;
  questionId: string;
  answer: string;
  answeredAt: Timestamp;
}

export interface BugKing {
  id: string;
  name: string;
  title: string;
  description: string;
  bio?: string;
  skills: string[];
  projects?: string[];
  achievements?: string[];
  imageUrl?: string;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection Names
export const COLLECTIONS = {
  USER_ROLES: 'userRoles',
  STUDENTS: 'students',
  SCHOOLS: 'schools',
  SCHOOL_OPTIONS: 'schoolOptions',
  STUDENT_TEST_RESULTS: 'studentTestResults',
  STUDENT_PROGRESS: 'studentProgress',
  BOOKINGS: 'bookings',
  CONSULTATION_BOOKINGS: 'consultationBookings',
  CONTACT_SUBMISSIONS: 'contactSubmissions',
  NEWSLETTER_SUBSCRIPTIONS: 'newsletterSubscriptions',
  PRODUCTS: 'products',
  SERVICES: 'services',
  SITE_SETTINGS: 'siteSettings',
  SCHOOL_EVALUATION_QUESTIONS: 'schoolEvaluationQuestions',
  STUDENT_CUSTOM_ANSWERS: 'studentCustomAnswers',
  BUG_KINGS: 'bugKings'
} as const;

