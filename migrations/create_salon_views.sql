-- Create salon_views table
CREATE TABLE IF NOT EXISTS salon_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  owner_email TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS salon_views_owner_email_idx ON salon_views(owner_email);
CREATE INDEX IF NOT EXISTS salon_views_viewed_at_idx ON salon_views(viewed_at);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_salon_view()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO salon_views (salon_id, owner_email)
  SELECT id, owner_email
  FROM salons
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to track views
CREATE TRIGGER track_salon_view
AFTER INSERT ON salon_views
FOR EACH ROW
EXECUTE FUNCTION increment_salon_view(); 