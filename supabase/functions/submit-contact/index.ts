// Edge Function: submit-contact
// Handles contact form submissions, validates input, inserts into tables,
// sends auto-reply via Resend, and forwards to admin for Feedback/Others.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactBody {
  name: string;
  email: string;
  contact_type: "Testimony" | "Review" | "Feedback" | "Others";
  message: string;
  consent_publish?: boolean;
  honeypot?: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "The Daily Beloved <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("Resend send failed:", await res.text());
  return res.ok;
}

function autoReplyHtml(name: string, type: string): { subject: string; html: string } {
  const messages: Record<string, string> = {
    Testimony: `Thank you for sharing your testimony, ${name}! We are truly blessed to hear how The Daily Beloved has touched your life. Your story has been received and will be reviewed. If approved and you gave consent, it may be shared on our site to encourage others.`,
    Review: `Thank you for your review, ${name}! We appreciate you taking the time to share your thoughts. Your feedback helps us serve the community better. Your review is pending approval and may appear on the site soon.`,
    Feedback: `Thank you for your feedback, ${name}! We value every thought shared with us. Your message has been received and forwarded to our team.`,
    Others: `Thank you for reaching out, ${name}! Your message has been received and we will get back to you as soon as possible.`,
  };
  const body = messages[type] || messages.Others;
  return {
    subject: "Thank you for reaching out — The Daily Beloved",
    html: `<div style="font-family: -apple-system, sans-serif; background:#0F172A; color:#E5E7EB; padding:24px;"><h2 style="color:#7F9A83;">The Daily Beloved</h2><p>${body}</p><p style="margin-top:24px; color:#9CA3AF; font-size:12px;">— The Daily Beloved Team</p></div>`,
  };
}

function adminForwardHtml(name: string, email: string, type: string, message: string): { subject: string; html: string } {
  return {
    subject: `[TDB Contact] New ${type} from ${name}`,
    html: `<div style="font-family: monospace; padding:24px;"><h3>New ${type} submission</h3><p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Type:</b> ${type}<br/><b>Date:</b> ${new Date().toISOString()}</p><p><b>Message:</b></p><pre style="background:#f3f4f6; padding:12px; white-space:pre-wrap;">${message}</pre></div>`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Honeypot check (silent discard)
  if (body.honeypot && body.honeypot.length > 0) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Validation
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const contact_type = body.contact_type;
  if (!name || !email || !message || !contact_type) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!["Testimony", "Review", "Feedback", "Others"].includes(contact_type)) {
    return new Response(JSON.stringify({ error: "Invalid contact_type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (name.length > 200 || email.length > 255 || message.length > 5000) {
    return new Response(JSON.stringify({ error: "Field too long" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Rate limit check (5/hour by IP)
  const ip = req.headers.get("CF-Connecting-IP") || req.headers.get("X-Forwarded-For") || "unknown";
  const ipBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  const ipHash = Array.from(new Uint8Array(ipBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await supabase.from("rate_limit_log").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).eq("action", "contact").gte("created_at", oneHourAgo);
  if ((count || 0) >= 5) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  await supabase.from("rate_limit_log").insert({ ip_hash: ipHash, action: "contact" });

  // Insert into contact_submissions
  const consent = contact_type === "Testimony" ? !!body.consent_publish : false;
  const { data: insertRow, error: insertErr } = await supabase
    .from("contact_submissions")
    .insert({ name, email, contact_type, message, consent_publish: consent })
    .select("id")
    .single();
  if (insertErr) {
    console.error("Insert error:", insertErr);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Branch: Testimony with consent → testimonies; Review → reviews
  if (contact_type === "Testimony" && consent) {
    await supabase.from("testimonies").insert({ name, email, message, status: "pending", consent_given: true, source: "contact" });
  }
  if (contact_type === "Review") {
    await supabase.from("reviews").insert({ name, email, message, status: "pending" });
  }

  // Send auto-reply
  const reply = autoReplyHtml(name, contact_type);
  const replied = await sendEmail(email, reply.subject, reply.html);
  if (replied) await supabase.from("contact_submissions").update({ auto_reply_sent: true }).eq("id", insertRow.id);

  // Forward to admin for Feedback/Others
  if ((contact_type === "Feedback" || contact_type === "Others") && ADMIN_EMAIL) {
    const fwd = adminForwardHtml(name, email, contact_type, message);
    const forwarded = await sendEmail(ADMIN_EMAIL, fwd.subject, fwd.html);
    if (forwarded) await supabase.from("contact_submissions").update({ forwarded: true }).eq("id", insertRow.id);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
