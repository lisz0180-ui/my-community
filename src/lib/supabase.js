import { createClient } from '@supabase/supabase-js';

/** Supabase 클라이언트 (백엔드 없이 프론트엔드에서 직접 연결) */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
