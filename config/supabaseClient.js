import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  // Staging Environment
  "https://ruiwkfwghvomxxhnmdpu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aXdrZndnaHZvbXh4aG5tZHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM1NTExNjcsImV4cCI6MjAwOTEyNzE2N30.Ydet1TPPWGFi7UQamM4gbzzR5APavKKop3NQbveEy9I"
  // Live Environment
  // "https://gytbjlatclocthcyugmq.supabase.co",
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dGJqbGF0Y2xvY3RoY3l1Z21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1NTE4MDgsImV4cCI6MjAwMDEyNzgwOH0.L-6L22Hq6AtWu3K3yo_thbnhdjkTA9niV0flTjvEXxU"
  );
