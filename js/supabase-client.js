// Configuracion publica de Supabase para conectar el frontend con Auth.
// Pega aqui tu Publishable key; nunca uses la Secret key en archivos del navegador.
const PLANIX_SUPABASE_URL = "https://gpfavktuunaetincyfoi.supabase.co";
const PLANIX_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LaK3DrBEuesS2PnvbYjU5A_6-F-iLty";

// Cliente compartido para que login.js y registro.js usen la misma conexion.
window.PlanixSupabase = window.supabase.createClient(
  PLANIX_SUPABASE_URL,
  PLANIX_SUPABASE_PUBLISHABLE_KEY
);
