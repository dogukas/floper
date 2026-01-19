
import { createClient } from '@supabase/supabase-js'

// Bu anahtarları .env.local dosyasında saklamanız güvenli olur
// Örnek:
// NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxh...

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
