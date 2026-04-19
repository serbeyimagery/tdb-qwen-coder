// Edge Function: claim-donation
// Updates donation status to 'claimed' and sends acknowledgment + admin notification emails.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "The Daily Beloved <onboarding@resend.dev>", to: [to], subject, html }),
  });
  if (!res.ok) console.error("Resend send failed:", await res.text());
  return res.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: { donation_id?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const donation_id = body.donation_id;
  if (!donation_id || !/^[0-9a-f-]{36}$/i.test(donation_id)) {
    return new Response(JSON.stringify({ error: "Invalid donation_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: donation, error: fetchErr } = await supabase.from("donations").select("*").eq("id", donation_id).single();
  if (fetchErr || !donation) {
    return new Response(JSON.stringify({ error: "Donation not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Idempotency
  if (donation.status !== "pending") {
    return new Response(JSON.stringify({ success: true, already_claimed: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  await supabase.from("donations").update({ status: "claimed" }).eq("id", donation_id);

  // Email #3 to donor
  const donorHtml = `<div style="font-family: -apple-system, sans-serif; background:#0F172A; color:#E5E7EB; padding:24px;"><h2 style="color:#7F9A83;">The Daily Beloved</h2><p>Dear ${donation.first_name},</p><p>Thank you for your generous heart! We have received your donation record and will personally review and confirm receipt within 1–3 business days. You will receive a confirmation email once verified.</p><p>If you have a testimony or review you'd like to share, we'd love to hear from you.</p><p style="font-size:12px; color:#9CA3AF;">Please note: The Daily Beloved is a non-profit ministry and does not currently issue BIR receipts. Your donation is a gift freely given to support free access to God's Word.</p><p>May God richly bless you!</p><p>— The Daily Beloved Team</p></div>`;
  const sent = await sendEmail(donation.email, "We received your donation note — The Daily Beloved", donorHtml);
  if (sent) await supabase.from("donations").update({ ack_email_sent: true }).eq("id", donation_id);

  // Email #4 to admin
  if (ADMIN_EMAIL) {
    const adminHtml = `<div style="font-family: monospace; padding:24px;"><h3>New donation claim</h3><p><b>Donor:</b> ${donation.first_name} ${donation.last_name}<br/><b>Email:</b> ${donation.email}<br/><b>Phone:</b> ${donation.phone || "Not provided"}<br/><b>Method:</b> ${donation.method}<br/><b>Record ID:</b> ${donation_id}</p></div>`;
    await sendEmail(ADMIN_EMAIL, `[TDB Donation] New Claim from ${donation.first_name} ${donation.last_name}`, adminHtml);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
