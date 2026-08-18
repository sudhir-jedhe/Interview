CREATE TABLE specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  tech_stack TEXT NOT NULL,
  complexity TEXT NOT NULL CHECK (complexity IN ('small', 'medium', 'large')),
  notes TEXT,
  generated_content JSONB,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
