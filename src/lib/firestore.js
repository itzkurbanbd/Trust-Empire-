import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  setDoc
} from 'firebase/firestore';

// Collection references
const productsCollection = collection(db, 'products');
const categoriesCollection = collection(db, 'categories');
const ordersCollection = collection(db, 'orders');
const usersCollection = collection(db, 'users');
const slidersCollection = collection(db, 'sliders');
const notificationsCollection = collection(db, 'notifications');

// Products
export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProductById = async (id) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getProductsByCategory = async (category) => {
  const q = query(productsCollection, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getFlashProducts = async () => {
  const q = query(productsCollection, where('isFlash', '==', true), limit(8));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getLatestProducts = async () => {
  const q = query(productsCollection, orderBy('createdAt', 'desc'), limit(8));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getFeaturedProducts = async () => {
  const q = query(productsCollection, where('isFeatured', '==', true), limit(8));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Categories
export const getCategories = async () => {
  const snapshot = await getDocs(categoriesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Sliders
export const getSliders = async () => {
  const snapshot = await getDocs(slidersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Orders
export const createOrder = async (orderData) => {
  const docRef = await addDoc(ordersCollection, {
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
  return docRef.id;
};

export const getUserOrders = async (userId) => {
  const q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Users
export const getUserByPhone = async (phone) => {
  const q = query(usersCollection, where('phone', '==', phone));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
};

export const createUser = async (userData) => {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    createdAt: new Date().toISOString(),
    wishlist: [],
    orders: []
  });
  return { id: docRef.id, ...userData };
};

export const updateUserWishlist = async (userId, wishlist) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { wishlist });
};

// Reviews
export const getProductReviews = async (productId) => {
  const reviewsRef = collection(db, 'products', productId, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addReview = async (productId, reviewData) => {
  const reviewsRef = collection(db, 'products', productId, 'reviews');
  const docRef = await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// Notifications
export const getUserNotifications = async (userId) => {
  const q = query(notificationsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markNotificationAsRead = async (notificationId) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
};

export const markAllNotificationsAsRead = async (userId) => {
  const q = query(notificationsCollection, where('userId', '==', userId), where('read', '==', false));
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map(doc => updateDoc(doc.ref, { read: true }));
  await Promise.all(updates);
};