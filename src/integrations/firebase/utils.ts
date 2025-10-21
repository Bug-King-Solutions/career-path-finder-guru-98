import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  WhereFilterOp,
  Query,
  DocumentData,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

// Helper function to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Helper function to convert Date to Firestore timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Generic CRUD operations

// Create a document with auto-generated ID
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

// Create a document with specific ID
export const createDocumentWithId = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

// Read a single document
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  
  return null;
};

// Read all documents in a collection
export const getAllDocuments = async <T extends DocumentData>(
  collectionName: string
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Update a document
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docId));
};

// Query documents with filters
export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  filters: Array<{ field: string; operator: WhereFilterOp; value: any }> = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
): Promise<T[]> => {
  let q: Query = collection(db, collectionName);
  
  // Apply filters
  filters.forEach(filter => {
    q = query(q, where(filter.field, filter.operator, filter.value));
  });
  
  // Apply ordering
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }
  
  // Apply limit
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Get documents by field value
export const getDocumentsByField = async <T extends DocumentData>(
  collectionName: string,
  field: string,
  value: any
): Promise<T[]> => {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Get single document by field value
export const getDocumentByField = async <T extends DocumentData>(
  collectionName: string,
  field: string,
  value: any
): Promise<T | null> => {
  const q = query(collection(db, collectionName), where(field, '==', value), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as T;
};

// Count documents in a collection
export const countDocuments = async (
  collectionName: string,
  filters: Array<{ field: string; operator: WhereFilterOp; value: any }> = []
): Promise<number> => {
  const docs = await queryDocuments(collectionName, filters);
  return docs.length;
};

