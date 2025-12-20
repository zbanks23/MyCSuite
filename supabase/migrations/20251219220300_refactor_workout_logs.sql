-- Rename 'notes' to 'exercises'
ALTER TABLE public.workout_logs RENAME COLUMN notes TO exercises;

-- Add new columns
ALTER TABLE public.workout_logs 
  ADD COLUMN workout_name TEXT,
  ADD COLUMN duration INTEGER;

-- Migrate data from JSON in 'exercises' column to new columns
-- We assume 'exercises' contains JSON string like {"name": "...", "duration": 123, "exercises": [...]}
UPDATE public.workout_logs
SET 
  workout_name = (exercises::jsonb)->>'name',
  duration = ((exercises::jsonb)->>'duration')::INTEGER
WHERE exercises IS NOT NULL AND exercises LIKE '{%';

-- Drop workout_id
ALTER TABLE public.workout_logs DROP COLUMN workout_id;


------- SET LOGS CHANGES -------

-- Add exercise_id column
ALTER TABLE public.set_logs
    ADD COLUMN exercise_id UUID REFERENCES public.exercises(exercise_id) ON DELETE SET NULL;

-- Backfill exercise_id from the details JSON
-- details is JSONB, e.g. {"exercise_id": "...", ...}
UPDATE public.set_logs
SET exercise_id = (details->>'exercise_id')::UUID
WHERE details->>'exercise_id' IS NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_set_logs_exercise_id ON public.set_logs(exercise_id);
