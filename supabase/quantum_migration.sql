-- MODUL 7: Quantum Generator Extensions
-- Menambahkan kolom untuk konten turunan AI (Flashcards, Quiz, Podcast Script)

ALTER TABLE public.learning_resources 
ADD COLUMN IF NOT EXISTS derived_content JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ai_persona_prompt TEXT,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending'; -- pending, processing, completed

-- Update Policy (Optional: Ensure Admin can update these new columns)
-- Existing robust policies should cover Update generally, but good to double check via RLS review if needed.
-- For now, the previous "Admins can manage resources" policy covers INSERT/UPDATE/DELETE on all columns.
