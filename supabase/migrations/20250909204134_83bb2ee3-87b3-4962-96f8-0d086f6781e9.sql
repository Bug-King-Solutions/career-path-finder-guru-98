-- First create dummy user entries for the schools (they won't be able to login but will have records)
-- We'll insert into auth.users via a function that bypasses normal signup flow

-- Create a function to insert school data without requiring user_id
CREATE OR REPLACE FUNCTION insert_school_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    school_user_id uuid;
BEGIN
    -- Generate UUIDs for school entries that won't conflict with real users
    -- We'll use fixed UUIDs so they're consistent
    
    -- Government Secondary School Bukuru
    school_user_id := 'aaaaaaaa-1111-1111-1111-111111111111'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'Government Secondary School Bukuru', 'admin@gssbukuru.edu.ng');
    
    -- Hillcrest School Jos
    school_user_id := 'aaaaaaaa-2222-2222-2222-222222222222'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'Hillcrest School Jos', 'info@hillcrestjos.org');
    
    -- Command Secondary School Jos
    school_user_id := 'aaaaaaaa-3333-3333-3333-333333333333'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'Command Secondary School Jos', 'admin@commandsecjos.edu.ng');
    
    -- Government Girls Secondary School Jos
    school_user_id := 'aaaaaaaa-4444-4444-4444-444444444444'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'Government Girls Secondary School Jos', 'admin@ggsjos.edu.ng');
    
    -- Federal Government College Jos
    school_user_id := 'aaaaaaaa-5555-5555-5555-555555555555'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'Federal Government College Jos', 'admin@fgcjos.edu.ng');
    
    -- University of Jos
    school_user_id := 'aaaaaaaa-6666-6666-6666-666666666666'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'University of Jos', 'info@unijos.edu.ng');
    
    -- Plateau State University Bokkos
    school_user_id := 'aaaaaaaa-7777-7777-7777-777777777777'::uuid;
    INSERT INTO public.schools (id, user_id, school_name, contact_email) VALUES
    (gen_random_uuid(), school_user_id, 'Plateau State University Bokkos', 'info@plasu.edu.ng');
END;
$$;

-- Execute the function to insert the school data
SELECT insert_school_data();

-- Drop the function as it's no longer needed
DROP FUNCTION insert_school_data();