# Firebase Migration Guide

## Overview
This project has been successfully migrated from Supabase to Firebase for backend services.

## What Changed

### 1. **Authentication**
- ✅ Migrated from Supabase Auth to Firebase Authentication
- ✅ Updated `AuthContext` to use Firebase Auth
- ✅ Updated `AuthPage` for sign-in and sign-up flows

### 2. **Database**
- ✅ Migrated from Supabase PostgreSQL to Firebase Firestore
- ✅ Created new type definitions in `src/integrations/firebase/types.ts`
- ✅ Created utility functions for CRUD operations in `src/integrations/firebase/utils.ts`

### 3. **Updated Files**
- ✅ `src/integrations/firebase/config.ts` - Firebase initialization
- ✅ `src/integrations/firebase/types.ts` - TypeScript types for collections
- ✅ `src/integrations/firebase/utils.ts` - Helper functions for Firestore operations
- ✅ `src/contexts/AuthContext.tsx` - Firebase Auth integration
- ✅ `src/pages/AuthPage.tsx` - Firebase Auth sign-in/sign-up
- ✅ `src/pages/StudentDashboard.tsx` - Firestore queries
- ✅ `src/pages/SchoolDashboard.tsx` - Firestore queries  
- ✅ `src/pages/AdminDashboard.tsx` - Firestore queries
- ✅ Removed `src/integrations/supabase/` directory
- ✅ Removed `supabase/` migrations directory

### 4. **Components Needing Manual Update**
The following components still reference Supabase and need to be updated manually:

1. `src/components/StudentManagement.tsx`
2. `src/components/SchoolEvaluationQuestions.tsx`
3. `src/components/StudentAnswersView.tsx`
4. `src/components/AdminQuestionManagement.tsx`
5. `src/components/AdminSchoolManagement.tsx`
6. `src/components/AdminStudentManagement.tsx`
7. `src/components/AdminContentManagement.tsx`

**To update these components:**
- Replace `import { supabase } from '@/integrations/supabase/client'` with Firebase imports
- Replace Supabase queries with Firestore queries using the utility functions
- Update property names to match new Firestore schema (camelCase instead of snake_case)

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password provider)
4. Create a Firestore database
5. Enable Storage if needed

### 2. Get Firebase Configuration
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click on the web app icon or "Add app"
4. Copy the Firebase configuration

### 3. Set Environment Variables
Create a `.env` file in the project root with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firestore Security Rules
Set up security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User roles collection
    match /userRoles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Students collection
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/userRoles/$(request.auth.uid)).data.role in ['admin', 'school']);
    }
    
    // Schools collection
    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/userRoles/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Other collections - adjust as needed
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Firebase Authentication Settings
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. (Optional) Configure email templates
4. (Optional) Set up authorized domains for production

## Firestore Collections Structure

The following collections are defined in `src/integrations/firebase/types.ts`:

- `userRoles` - User role assignments
- `students` - Student profiles
- `schools` - School profiles
- `schoolOptions` - Pre-defined school list
- `studentTestResults` - Psychology test results
- `studentProgress` - Career exploration progress
- `bookings` - Consultation bookings
- `consultationBookings` - Business consultations
- `contactSubmissions` - Contact form submissions
- `newsletterSubscriptions` - Email subscriptions
- `products` - Product listings
- `services` - Service offerings
- `siteSettings` - CMS content
- `schoolEvaluationQuestions` - Custom school questions
- `studentCustomAnswers` - Student responses
- `bugKings` - Portfolio/team profiles

## Utility Functions

Located in `src/integrations/firebase/utils.ts`:

- `createDocument(collection, data)` - Create document with auto-generated ID
- `createDocumentWithId(collection, docId, data)` - Create document with specific ID
- `getDocument(collection, docId)` - Get single document
- `getAllDocuments(collection)` - Get all documents in collection
- `updateDocument(collection, docId, data)` - Update document
- `deleteDocument(collection, docId)` - Delete document
- `queryDocuments(collection, filters, orderBy, direction, limit)` - Query with filters
- `getDocumentsByField(collection, field, value)` - Get documents by field value
- `getDocumentByField(collection, field, value)` - Get single document by field

## Data Migration

If you have existing data in Supabase, you'll need to:

1. Export data from Supabase
2. Transform field names from snake_case to camelCase
3. Transform timestamp fields to Firestore Timestamps
4. Import data into Firestore using Firebase Admin SDK or manual import

## Testing

1. Run the development server: `npm run dev`
2. Test authentication (sign up, sign in, sign out)
3. Test dashboard access based on roles
4. Verify data operations work correctly

## Dependencies

- `firebase` - v10.x (installed)
- Removed: `@supabase/supabase-js`

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Test authentication flows
4. ⏳ Update remaining 7 components
5. ⏳ Migrate existing data (if any)
6. ⏳ Set up Firestore security rules
7. ⏳ Test all features thoroughly
8. ⏳ Deploy to production

## Troubleshooting

### Common Issues

**Issue**: "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Check that your API key in `.env` is correct

**Issue**: "Permission denied" errors in Firestore
- **Solution**: Update Firestore security rules to allow necessary operations

**Issue**: Components still importing Supabase
- **Solution**: Update the 7 remaining components listed above

**Issue**: TypeScript errors for camelCase properties
- **Solution**: Update property access to use camelCase (e.g., `first_name` → `firstName`)

## Support

For Firebase-specific questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

