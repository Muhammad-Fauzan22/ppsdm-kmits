-- Memastikan kolom status memiliki default value 'queued'
ALTER TABLE learning_resources 
ALTER COLUMN status SET DEFAULT 'queued';

-- Memastikan kolom created_at memiliki default timestamp sekarang
ALTER TABLE learning_resources 
ALTER COLUMN created_at SET DEFAULT now();

-- (Opsional) Indexing agar Query Dashboard Cepat
CREATE INDEX IF NOT EXISTS idx_learning_resources_status 
ON learning_resources(status);

CREATE INDEX IF NOT EXISTS idx_learning_resources_created_at 
ON learning_resources(created_at DESC);
