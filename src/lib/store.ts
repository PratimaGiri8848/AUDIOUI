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
          try {
            // Fetch all settings in parallel
            const [
              { data: generalData, error: generalError },
              { data: voiceData, error: voiceError },
              { data: playerData, error: playerError },
              { data: websiteData, error: websiteError }
            ] = await Promise.all([
              supabase.from('general_settings').select('*').eq('user_id', data.user.id).single(),
              supabase.from('voice_settings').select('*').eq('user_id', data.user.id).single(),
              supabase.from('player_settings').select('*').eq('user_id', data.user.id).single(),
              supabase.from('website_settings').select('*').eq('user_id', data.user.id).single(),
            ]);

            // Check for errors
            if (generalError) console.error('Error fetching general settings:', generalError);
            if (voiceError) console.error('Error fetching voice settings:', voiceError);
            if (playerError) console.error('Error fetching player settings:', playerError);
            if (websiteError) console.error('Error fetching website settings:', websiteError);

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
          } catch (error) {
            console.error('Error fetching settings:', error);
            throw new Error('Failed to fetch user settings');
          }
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
          try {
            // Insert default settings for new user
            const results = await Promise.all([
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

            // Check for errors in results
            results.forEach((result, index) => {
              if (result.error) {
                console.error(`Error inserting settings for table ${index}:`, result.error);
              }
            });

            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata.name || email.split('@')[0],
              },
              isAuthenticated: true,
              settings: defaultSettings,
            });
          } catch (error) {
            console.error('Error creating user settings:', error);
            throw new Error('Failed to create user settings');
          }
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

        try {
          if (newSettings.general) {
            const { error } = await supabase
              .from('general_settings')
              .upsert({ 
                user_id: state.user.id, 
                ...newSettings.general 
              });
            
            if (error) {
              console.error('Error updating general settings:', error);
              throw error;
            }
          }

          if (newSettings.voice) {
            const { error } = await supabase
              .from('voice_settings')
              .upsert({ 
                user_id: state.user.id, 
                ...newSettings.voice 
              });
            
            if (error) {
              console.error('Error updating voice settings:', error);
              throw error;
            }
          }

          if (newSettings.player) {
            const { error } = await supabase
              .from('player_settings')
              .upsert({ 
                user_id: state.user.id, 
                ...newSettings.player 
              });
            
            if (error) {
              console.error('Error updating player settings:', error);
              throw error;
            }
          }

          if (newSettings.websites) {
            const { error } = await supabase
              .from('website_settings')
              .upsert({ 
                user_id: state.user.id, 
                ...newSettings.websites 
              });
            
            if (error) {
              console.error('Error updating website settings:', error);
              throw error;
            }
          }

          // Update local state if all database operations succeeded
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