-- Clear existing sample data
DELETE FROM public.gps_fix;
DELETE FROM public.detection_info;
DELETE FROM public."Remora";

-- Insert sample data for 2024 and 2025
-- Each year: 12 months × 100 records = 1200 records per year = 2400 total records
DO $$
DECLARE
    year_val INT;
    month_val INT;
    day_val INT;
    record_count INT;
    base_timestamp DOUBLE PRECISION;
    random_offset INT;
    remora_id_val INT;
    people_count_val INT;
    car_count_val INT;
    lat_val DOUBLE PRECISION;
    lng_val DOUBLE PRECISION;
    alt_val DOUBLE PRECISION;
BEGIN
    -- Loop through years 2024 and 2025
    FOR year_val IN 2024..2025 LOOP
        -- Loop through months 1-12
        FOR month_val IN 1..12 LOOP
            -- Generate 100 records per month
            FOR record_count IN 1..100 LOOP
                -- Random day in the month (1-28 to avoid month boundary issues)
                day_val := 1 + (random() * 27)::INT;
                
                -- Base timestamp for the day
                base_timestamp := EXTRACT(EPOCH FROM make_date(year_val, month_val, day_val));
                
                -- Random time offset within the day (0-86400 seconds)
                random_offset := (random() * 86400)::INT;
                base_timestamp := base_timestamp + random_offset;
                
                -- Random values for detection data
                remora_id_val := 1000 + (random() * 50)::INT; -- Remora IDs 1000-1050
                people_count_val := (random() * 15)::INT; -- 0-15 people
                car_count_val := (random() * 10)::INT; -- 0-10 cars
                
                -- Random coordinates (global distribution)
                lat_val := -90 + (random() * 180); -- -90 to 90
                lng_val := -180 + (random() * 360); -- -180 to 180
                alt_val := (random() * 1000); -- 0-1000 meters altitude
                
                -- Insert Remora if not exists
                INSERT INTO public."Remora" (remora_id)
                VALUES (remora_id_val)
                ON CONFLICT (remora_id) DO NOTHING;
                
                -- Insert detection info
                INSERT INTO public.detection_info (remora_id, people_count, car_count, "timestamp")
                VALUES (remora_id_val, people_count_val, car_count_val, base_timestamp);
                
                -- Insert GPS fix
                INSERT INTO public.gps_fix (remora_id, location, altitude, "timestamp")
                VALUES (remora_id_val, ST_SetSRID(ST_MakePoint(lng_val, lat_val), 4326), alt_val, base_timestamp);
            END LOOP;
        END LOOP;
    END LOOP;
END $$;