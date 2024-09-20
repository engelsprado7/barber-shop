// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbpevdsjhxfupprzdjzi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicGV2ZHNqaHhmdXBwcnpkanppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1NDc5NzAsImV4cCI6MjA0MjEyMzk3MH0.TGzAlMDFKhP4gj24uRpcCysvniYHfGY7GSHLSYdRcCU';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
