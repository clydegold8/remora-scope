-- Create sample detection data with GPS coordinates
DO $$
DECLARE
    i INT;
    sample_timestamp DOUBLE PRECISION;
    sample_remora_id INT;
    sample_people INT;
    sample_cars INT;
    sample_lat DOUBLE PRECISION;
    sample_lng DOUBLE PRECISION;
    sample_alt DOUBLE PRECISION;
BEGIN
    -- Clear existing data first
    DELETE FROM public.gps_fix;
    DELETE FROM public.detection_info;
    DELETE FROM public."Remora";
    
    FOR i IN 1..50 LOOP
        -- Generate random data
        sample_timestamp := EXTRACT(EPOCH FROM (NOW() - (random() * INTERVAL '30 days')));
        sample_remora_id := (i % 10) + 1; -- Use 10 different remora sensors
        sample_people := (random() * 20)::INT; -- 0-20 people
        sample_cars := (random() * 15)::INT; -- 0-15 cars
        
        -- Generate coordinates around urban areas (e.g., New York area)
        sample_lat := 40.7128 + (random() - 0.5) * 0.1; -- Around NYC
        sample_lng := -74.0060 + (random() - 0.5) * 0.1;
        sample_alt := 10 + random() * 50; -- 10-60 meters altitude
        
        -- Insert Remora if not exists
        INSERT INTO public."Remora" (remora_id)
        VALUES (sample_remora_id)
        ON CONFLICT (remora_id) DO NOTHING;
        
        -- Insert detection info
        INSERT INTO public.detection_info (remora_id, people_count, car_count, timestamp)
        VALUES (sample_remora_id, sample_people, sample_cars, sample_timestamp);
        
        -- Insert GPS data
        INSERT INTO public.gps_fix (remora_id, location, altitude, timestamp)
        VALUES (sample_remora_id, ST_SetSRID(ST_MakePoint(sample_lng, sample_lat), 4326), sample_alt, sample_timestamp);
    END LOOP;
END $$;

-- Create user invitations table
CREATE TABLE IF NOT EXISTS public.user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    temp_password TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    is_first_login BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on invitations
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for invitations (only admins can manage invitations)
CREATE POLICY "Only authenticated users can view invitations"
ON public.user_invitations
FOR SELECT
TO authenticated
USING (auth.uid() = invited_by OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Only authenticated users can create invitations"
ON public.user_invitations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = invited_by);