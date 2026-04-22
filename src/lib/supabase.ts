import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL Setup for Supabase:
 *
 * -- Create bookmarks table
 * create table bookmarks (
 *   id uuid default uuid_generate_v4() primary key,
 *   user_id uuid references auth.users not null,
 *   job_id text not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(user_id, job_id)
 * );
 *
 * -- Create applications table
 * create table applications (
 *   id uuid default uuid_generate_v4() primary key,
 *   user_id uuid references auth.users not null,
 *   job_id text not null,
 *   status text check (status in ('Draft', 'Applied', 'Interviewing', 'Offered', 'Rejected')) default 'Draft',
 *   applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(user_id, job_id)
 * );
 *
 * -- Enable Row Level Security (RLS)
 * alter table bookmarks enable row level security;
 * alter table applications enable row level security;
 *
 * -- Create policies
 * create policy "Users can manage their own bookmarks"
 *   on bookmarks for all
 *   using (auth.uid() = user_id);
 *
 * create policy "Users can manage their own applications"
 *   on applications for all
 *   using (auth.uid() = user_id);
 */
