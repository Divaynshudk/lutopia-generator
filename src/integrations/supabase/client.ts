// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aprgtkmkovyuchtgepux.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcmd0a21rb3Z5dWNodGdlcHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTMyMzgsImV4cCI6MjA1NjY2OTIzOH0.s4b82GThZXChHpPizp4neQjY_0w3jSznZvK_ON9GO9c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);