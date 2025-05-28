import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { isValidUUID } from './utils';

interface User {
  id: string;
  email: string;
  name: string;
}

interface GeneralSettings {
  sessionization: boolean;
  autoconvert: boolean;
}

interface VoiceSettings {
  autoselectVoice: boolean;
  voiceProvider: string;
  language: string;
  gender: string;
  defaultVoice: string;
  defaultModel: string;
}

interface PlayerSettings {
  smallPlayer: boolean;
  volumeControl: boolean;
  rewindForward: boolean;
  speedControl: boolean;
  textColor: string;
  bgColor: string;
}

interface WebsiteSettings {
  allowedUrls: string[];
  disallowedWords: string[];
  disallowedUrls: string[];
}

interface Settings {
  general: GeneralSettings;
  voice: VoiceSettings;
  player: PlayerSettings;
  websites: WebsiteSettings;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  settings: Settings;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
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

        if (error) throw error;

        if (data.user) {
          // Fetch all settings in parallel
          const [
            { data: generalData },
            { data: voiceData },
            { data: playerData },
            { data: websiteData }
          ] = await Promise.all([
            supabase.from('general_settings').select('*').eq('user_id', data.user.id).single(),
            supabase.from('voice_settings').select('*').eq('user_id', data.user.id).single(),
            supabase.from('player_settings').select('*').eq('user_id', data.user.id).single(),
            supabase.from('website_settings').select('*').eq('user_id', data.user.id).single(),
          ]);

          const settings: Settings = {
            general: generalData || defaultSettings.general,
            voice: voiceData || defaultSettings.voice,
            player: playerData || defaultSettings.player,
            websites: websiteData || defaultSettings.websites,
          };

          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata.name || email.split('@')[0],
            },
            isAuthenticated: true,
            settings,
          });
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Insert default settings for new user
          await Promise.all([
            supabase.from('general_settings').insert({
              user_id: data.user.id,
              ...defaultSettings.general,
            }),
            supabase.from('voice_settings').insert({
              user_id: data.user.id,
              ...defaultSettings.voice,
            }),
            supabase.from('player_settings').insert({
              user_id: data.user.id,
              ...defaultSettings.player,
            }),
            supabase.from('website_settings').insert({
              user_id: data.user.id,
              ...defaultSettings.websites,
            }),
          ]);

          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata.name || email.split('@')[0],
            },
            isAuthenticated: true,
            settings: defaultSettings,
          });
        }
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, isAuthenticated: false, settings: defaultSettings });
      },

      updateSettings: async (newSettings: Partial<Settings>) => {
        const state = get();
        if (!state.user) {
          console.error('No user found in state');
          throw new Error('User not authenticated');
        }

        if (!isValidUUID(state.user.id)) {
          console.error('Invalid user ID detected');
          await get().signOut();
          throw new Error('Invalid session detected. Please sign in again.');
        }

        const updates = [];

        if (newSettings.general) {
          updates.push(
            supabase
              .from('general_settings')
              .upsert({ user_id: state.user.id, ...newSettings.general })
          );
        }

        if (newSettings.voice) {
          updates.push(
            supabase
              .from('voice_settings')
              .upsert({ user_id: state.user.id, ...newSettings.voice })
          );
        }

        if (newSettings.player) {
          updates.push(
            supabase
              .from('player_settings')
              .upsert({ user_id: state.user.id, ...newSettings.player })
          );
        }

        if (newSettings.websites) {
          updates.push(
            supabase
              .from('website_settings')
              .upsert({ user_id: state.user.id, ...newSettings.websites })
          );
        }

        try {
          await Promise.all(updates);
          set({
            settings: {
              ...state.settings,
              ...newSettings,
            },
          });
        } catch (error) {
          console.error('Failed to update settings:', error);
          throw new Error('Failed to save settings');
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);