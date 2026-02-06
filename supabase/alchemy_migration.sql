-- MODUL 8: Content Alchemy Engine (NotebookLLM++ Features)
-- Menambahkan kolom untuk Mind Map, Slides, Infografis, dan Data Tables

ALTER TABLE public.learning_resources 
ADD COLUMN IF NOT EXISTS mind_map_data TEXT,          -- Mermaid.js Syntax string
ADD COLUMN IF NOT EXISTS slide_dock JSONB DEFAULT '[]'::jsonb, -- Array of Slide objects
ADD COLUMN IF NOT EXISTS infographic_data JSONB DEFAULT '{}'::jsonb, -- Stats key-value
ADD COLUMN IF NOT EXISTS tabular_data JSONB DEFAULT '[]'::jsonb; -- Array of structured data tables

-- Note: 'derived_content' dari Modul 7 tetap digunakan untuk Quantum basics (Microlearning, Quiz, Sim)
-- Kolom baru ini khusus untuk fitur Advance Alchemy yang butuh struktur data lebih kompleks.
