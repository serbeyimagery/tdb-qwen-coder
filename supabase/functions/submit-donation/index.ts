// Edge Function: submit-donation
// Creates a 'pending' donation record and returns the ID for the claim step.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DonationBody {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  method: "wallet" | "online" | "bank";
  honeypot?: string;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: DonationBody;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  if (body.honeypot && body.honeypot.length > 0) {
    return new Response(JSON.stringify({ success: true, donation_id: null }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const first_name = (body.first_name || "").trim();
  const last_name = (body.last_name || "").trim();
  const email = (body.email || "").trim();
  const phone = body.phone ? body.phone.trim() : null;
  const method = body.method;

  if (!first_name || !last_name || !email || !method) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!["wallet", "online", "bank"].includes(method)) {
    return new Response(JSON.stringify({ error: "Invalid method" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (first_name.length > 100 || last_name.length > 100 || email.length > 255) {
    return new Response(JSON.stringify({ error: "Field too long" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Rate limit (3/hour)
  const ip = req.headers.get("CF-Connecting-IP") || req.headers.get("X-Forwarded-For") || "unknown";
  const ipBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  const ipHash = Array.from(new Uint8Array(ipBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await supabase.from("rate_limit_log").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).eq("action", "donation").gte("created_at", oneHourAgo);
  if ((count || 0) >= 3) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  await supabase.from("rate_limit_log").insert({ ip_hash: ipHash, action: "donation" });

  const { data, error } = await supabase
    .from("donations")
    .insert({ first_name, last_name, email, phone, method, status: "pending" })
    .select("id")
    .single();
  if (error) {
    console.error("Insert error:", error);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ donation_id: data.id }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
