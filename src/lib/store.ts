import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata.name || email.split('@')[0],
            },
            isAuthenticated: true,
          });
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: name,
            },
            isAuthenticated: true,
          });
        }
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw new Error(error.message);
        }

        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);