-- Fix security issues and syntax error

-- Enable RLS on missing tables (excluding views)
ALTER TABLE public."Remora" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_fix ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is monitoring data)
CREATE POLICY "Allow authenticated read access to Remora"
ON public."Remora"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access to detection_info"
ON public.detection_info
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access to gps_fix"
ON public.gps_fix
FOR SELECT
TO authenticated
USING (true);

-- Fix the existing functions by setting search_path
CREATE OR REPLACE FUNCTION public.delete_full_detection(p_detection_id integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    v_remora_id int;
    v_timestamp double precision;
BEGIN
    SELECT remora_id, "timestamp"
    INTO v_remora_id, v_timestamp
    FROM public.detection_info
    WHERE id = p_detection_id;

    DELETE FROM public.gps_fix
    WHERE remora_id = v_remora_id AND "timestamp" = v_timestamp;

    DELETE FROM public.detection_info
    WHERE id = p_detection_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_full_detection(p_remora_id integer, p_people_count integer, p_car_count integer, p_latitude double precision, p_longitude double precision, p_altitude double precision)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    v_timestamp double precision := EXTRACT(EPOCH FROM NOW());
BEGIN
    INSERT INTO public."Remora" (remora_id)
    VALUES (p_remora_id)
    ON CONFLICT (remora_id) DO NOTHING;

    INSERT INTO public.detection_info (remora_id, people_count, car_count, "timestamp")
    VALUES (p_remora_id, p_people_count, p_car_count, v_timestamp);

    IF p_latitude IS NOT NULL AND p_longitude IS NOT NULL THEN
        INSERT INTO public.gps_fix (remora_id, location, altitude, "timestamp")
        VALUES (p_remora_id, ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326), p_altitude, v_timestamp);
    END IF;
END;
$function$;