-- Fix security definer view by recreating detection_details as a regular view
-- This ensures it uses the querying user's permissions rather than creator's permissions
DROP VIEW IF EXISTS public.detection_details;

-- Recreate the view without SECURITY DEFINER
CREATE VIEW public.detection_details AS
SELECT 
    di.id,
    di.remora_id,
    di.people_count,
    di.car_count,
    di.timestamp,
    di.created_at,
    gf.location,
    gf.altitude,
    gf.id as gps_fix_id
FROM public.detection_info di
LEFT JOIN public.gps_fix gf ON di.remora_id = gf.remora_id AND di.timestamp = gf.timestamp;