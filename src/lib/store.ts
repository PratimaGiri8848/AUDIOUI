import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  name: string;
  emailConfirmed?: boolean;
}

interface Settings {
  general: {
    sessionization: boolean;
    autoconvert: boolean;
  };
  voice: {
    autoselectVoice: boolean;
    voiceProvider: string;
    language: string;
    gender: string;
    defaultVoice: string;
    defaultModel: string;
  };
  player: {
    smallPlayer: boolean;
    volumeControl: boolean;
    rewindForward: boolean;
    speedControl: boolean;
    textColor: string;
    bgColor: string;
  };
  websites: {
    allowedUrls: string[];
    disallowedWords: string[];
    disallowedUrls: string[];
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  settings: Settings;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

const defaultSettings: Settings = {
  general: {
    sessionization: false,
    autoconvert: true,
  },
  voice: {
    autoselectVoice: true,
    voiceProvider: "11Labs",
    language: "English",
    gender: "Male",
    defaultVoice: "Rachel",
    defaultModel: "Eleven Multilingual v2",
  },
  player: {
    smallPlayer: true,
    volumeControl: true,
    rewindForward: true,
    speedControl: true,
    textColor: "#2134c2ff",
    bgColor: "#000000ff",
  },
  websites: {
    allowedUrls: ["https://elevenlabs.io/blog/"],
    disallowedWords: ["admin", "login"],
    disallowedUrls: [],
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      settings: defaultSettings,

      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!data.user?.email_confirmed_at) {
          throw new Error('Please confirm your email address before signing in');
        }

        if (data.user) {
          // Fetch user settings
          const { data: settingsData, error: settingsError } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', data.user.id)
            .single();

          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata.name || email.split('@')[0],
              emailConfirmed: !!data.user.email_confirmed_at,
            },
            isAuthenticated: true,
            settings: settingsData?.settings || defaultSettings,
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
            emailRedirectTo: `${window.location.origin}/signin`,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          throw new Error('Please check your email to confirm your account before signing in');
        }
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw new Error(error.message);
        }

        set({ user: null, isAuthenticated: false, settings: defaultSettings });
      },

      updateSettings: async (newSettings: Partial<Settings>) => {
        const state = get();
        if (!state.user) return;

        const updatedSettings = {
          ...state.settings,
          ...newSettings,
        };

        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: state.user.id,
            settings: updatedSettings,
          });

        if (error) {
          throw new Error('Failed to save settings');
        }

        set({ settings: updatedSettings });
      },

      resendConfirmationEmail: async (email: string) => {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
        });

        if (error) {
          throw new Error(error.message);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);