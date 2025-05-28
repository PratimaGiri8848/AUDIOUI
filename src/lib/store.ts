import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, googleProvider } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  UserCredential 
} from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const mapUserData = (credential: UserCredential): User => ({
  id: credential.user.uid,
  email: credential.user.email || '',
  name: credential.user.displayName || credential.user.email?.split('@')[0] || '',
  photoURL: credential.user.photoURL || undefined,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          set({
            user: mapUserData(credential),
            isAuthenticated: true,
          });
        } catch (error) {
          throw new Error('Invalid email or password');
        }
      },

      signInWithGoogle: async () => {
        try {
          const credential = await signInWithPopup(auth, googleProvider);
          set({
            user: mapUserData(credential),
            isAuthenticated: true,
          });
        } catch (error) {
          throw new Error('Google sign in failed');
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          set({
            user: {
              id: credential.user.uid,
              email,
              name,
            },
            isAuthenticated: true,
          });
        } catch (error) {
          throw new Error('Sign up failed');
        }
      },

      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          throw new Error('Sign out failed');
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);