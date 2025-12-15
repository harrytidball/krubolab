import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;
let initPromise = null;

// Initialize Supabase client by fetching credentials from Cloudflare Worker
async function initializeSupabase() {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const response = await fetch('/supabase-config');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Supabase config: ${response.status}`);
      }

      const config = await response.json();
      
      if (!config.url || !config.anonKey) {
        throw new Error('Invalid Supabase configuration received');
      }

      supabaseClient = createClient(config.url, config.anonKey);
      return supabaseClient;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

// Export a function that returns the initialized Supabase client
export async function getSupabaseClient() {
  return await initializeSupabase();
}

// Export the client directly for backward compatibility (will be null until initialized)
export const supabase = null;
