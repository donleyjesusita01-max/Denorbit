// One-time admin bootstrap. Creates the admin user (idempotent) and grants admin role.
// Reads credentials from environment so they never sit in source control.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const email = Deno.env.get("BOOTSTRAP_ADMIN_EMAIL")!;
    const password = Deno.env.get("BOOTSTRAP_ADMIN_PASSWORD")!;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing BOOTSTRAP_ADMIN_EMAIL/PASSWORD" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Try to create the user (auto-confirmed)
    let userId: string | null = null;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
    });

    if (createErr) {
      // Likely already exists — look it up
      const { data: list, error: listErr } = await admin.auth.admin.listUsers();
      if (listErr) throw listErr;
      const found = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (!found) throw createErr;
      userId = found.id;
      // Reset password to the requested one (so the user can sign in even if it pre-existed)
      await admin.auth.admin.updateUserById(found.id, { password, email_confirm: true });
    } else {
      userId = created.user!.id;
    }

    // Grant admin role (idempotent)
    const { error: roleErr } = await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (roleErr) throw roleErr;

    return new Response(JSON.stringify({ ok: true, user_id: userId, email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
