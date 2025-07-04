import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  userType: 'admin' | 'pharmacist' | null;
  login: (email: string, password: string) => Promise<'admin' | 'pharmacist'>;
  register: (email: string, password: string, pharmacyData: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'admin' | 'pharmacist' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserType(userDoc.data().type);
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
        }
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<'admin' | 'pharmacist'> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user type immediately after login
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userType = userData.type as 'admin' | 'pharmacist';
      setUserType(userType);
      return userType;
    } else {
      throw new Error('User data not found');
    }
  };

  const register = async (email: string, password: string, pharmacyData: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      type: 'pharmacist',
      createdAt: new Date().toISOString()
    });

    // Create pharmacy document
    await setDoc(doc(db, 'pharmacies', user.uid), {
      ...pharmacyData,
      ownerId: user.uid,
      status: 'fermé',
      verified: false,
      createdAt: new Date().toISOString()
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    userType,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};