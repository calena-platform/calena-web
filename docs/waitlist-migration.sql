-- Waitlist table for calena.com.au
-- Run in Supabase → SQL Editor before testing the waitlist form
-- Project: https://supabase.com/dashboard/project/tqyojszxqzhbbxnzgvge/sql

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'calena.com.au',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so non-authenticated visitors can join waitlist)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read waitlist
CREATE POLICY "Authenticated users can read waitlist" ON public.waitlist
  FOR SELECT USING (auth.role() = 'authenticated');
