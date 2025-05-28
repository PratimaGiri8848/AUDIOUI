-- Create tables for settings
CREATE TABLE IF NOT EXISTS general_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sessionization BOOLEAN NOT NULL DEFAULT false,
  autoconvert BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS voice_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  autoselectVoice BOOLEAN NOT NULL DEFAULT true,
  voiceProvider TEXT NOT NULL DEFAULT '11Labs',
  language TEXT NOT NULL DEFAULT 'English',
  gender TEXT NOT NULL DEFAULT 'Male',
  defaultVoice TEXT NOT NULL DEFAULT 'Rachel',
  defaultModel TEXT NOT NULL DEFAULT 'Eleven Multilingual v2',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS player_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  smallPlayer BOOLEAN NOT NULL DEFAULT true,
  volumeControl BOOLEAN NOT NULL DEFAULT true,
  rewindForward BOOLEAN NOT NULL DEFAULT true,
  speedControl BOOLEAN NOT NULL DEFAULT true,
  textColor TEXT NOT NULL DEFAULT '#2134c2ff',
  bgColor TEXT NOT NULL DEFAULT '#000000ff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  allowedUrls TEXT[] NOT NULL DEFAULT ARRAY['https://elevenlabs.io/blog/'],
  disallowedWords TEXT[] NOT NULL DEFAULT ARRAY['admin', 'login'],
  disallowedUrls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Create or replace the updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_general_settings_updated_at ON general_settings;
DROP TRIGGER IF EXISTS update_voice_settings_updated_at ON voice_settings;
DROP TRIGGER IF EXISTS update_player_settings_updated_at ON player_settings;
DROP TRIGGER IF EXISTS update_website_settings_updated_at ON website_settings;

-- Create triggers
CREATE TRIGGER update_general_settings_updated_at
  BEFORE UPDATE ON general_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_settings_updated_at
  BEFORE UPDATE ON voice_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_settings_updated_at
  BEFORE UPDATE ON player_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON website_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE general_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own general settings" ON general_settings;
DROP POLICY IF EXISTS "Users can insert their own general settings" ON general_settings;
DROP POLICY IF EXISTS "Users can update their own general settings" ON general_settings;

DROP POLICY IF EXISTS "Users can read their own voice settings" ON voice_settings;
DROP POLICY IF EXISTS "Users can insert their own voice settings" ON voice_settings;
DROP POLICY IF EXISTS "Users can update their own voice settings" ON voice_settings;

DROP POLICY IF EXISTS "Users can read their own player settings" ON player_settings;
DROP POLICY IF EXISTS "Users can insert their own player settings" ON player_settings;
DROP POLICY IF EXISTS "Users can update their own player settings" ON player_settings;

DROP POLICY IF EXISTS "Users can read their own website settings" ON website_settings;
DROP POLICY IF EXISTS "Users can insert their own website settings" ON website_settings;
DROP POLICY IF EXISTS "Users can update their own website settings" ON website_settings;

-- Create RLS policies
CREATE POLICY "Users can read their own general settings"
  ON general_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own general settings"
  ON general_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own general settings"
  ON general_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own voice settings"
  ON voice_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own voice settings"
  ON voice_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice settings"
  ON voice_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own player settings"
  ON player_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own player settings"
  ON player_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player settings"
  ON player_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own website settings"
  ON website_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own website settings"
  ON website_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own website settings"
  ON website_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);