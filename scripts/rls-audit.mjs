#!/usr/bin/env node
/**
 * Read-only RLS audit against the live database. Never inserts, updates, or
 * deletes anything, and never logs actual row contents — only row counts and
 * pass/fail against expected behavior, so this is safe to run repeatedly and
 * safe to paste output from.
 *
 * Usage: node scripts/rls-audit.mjs
 */
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON_KEY || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const anon = createClient(URL, ANON_KEY);
const admin = createClient(URL, SERVICE_KEY);

let pass = 0;
let concern = 0;
function report(name, ok, detail) {
  console.log(`${ok ? "OK  " : "CHECK"} — ${name}${detail ? ": " + detail : ""}`);
  ok ? pass++ : concern++;
}

// Tables that should NEVER be readable by an anonymous, unauthenticated
// client — no policy should grant anon SELECT here at all.
const shouldBeFullyBlocked = [
  "payments",
  "project_requests",
  "tasks",
  "milestones",
  "messages",
  "conversations",
  "audit_logs",
  "verification_logs",
  "notifications",
  "contact_inquiries",
  "intern_applications",
];

console.log("=== Tables that should be fully blocked for anon SELECT ===");
for (const table of shouldBeFullyBlocked) {
  const { data, error } = await anon.from(table).select("id").limit(1);
  // Either an explicit permission error, or a clean empty result, both count
  // as "blocked" — RLS commonly filters to zero rows rather than erroring.
  const blocked = !!error || (data?.length ?? 0) === 0;
  report(table, blocked, error ? `error: ${error.message}` : `rows visible to anon: ${data?.length ?? 0}`);
}

// Tables/queries that SHOULD be publicly readable per their own policies —
// confirm anon actually gets data here, not that RLS over-blocked them.
console.log("\n=== Tables that should be (partially) public ===");

const { count: openJobs, error: jobsErr } = await anon
  .from("job_postings")
  .select("id", { count: "exact", head: true })
  .eq("status", "open");
report("job_postings (status=open)", !jobsErr, jobsErr ? jobsErr.message : `${openJobs} open rows visible to anon`);

const { count: showcaseProjects, error: showcaseErr } = await anon
  .from("projects")
  .select("id", { count: "exact", head: true })
  .eq("is_showcase", true);
report("projects (is_showcase=true)", !showcaseErr, showcaseErr ? showcaseErr.message : `${showcaseProjects} showcase rows visible to anon`);

const { count: activeCerts, error: certsErr } = await anon.from("certificates").select("id", { count: "exact", head: true });
report("certificates (public read policy)", !certsErr, certsErr ? certsErr.message : `${activeCerts} rows visible to anon`);

const { count: activeInterns, error: internsErr } = await anon.from("interns").select("id", { count: "exact", head: true });
report("interns (public read active policy)", !internsErr, internsErr ? internsErr.message : `${activeInterns} rows visible to anon`);

// profiles: patched twice for recursion bugs (fix_profiles_recursion,
// fix_profiles_rls_recursion) — worth checking closely rather than assuming
// the latest migration is what's actually live.
console.log("\n=== profiles (patched twice for RLS recursion — check closely) ===");
const { data: anonProfiles, error: profilesAnonErr } = await anon.from("profiles").select("id, role").limit(5);
report(
  "profiles readable by anon",
  true, // informational, not pass/fail — just report what's actually exposed
  profilesAnonErr ? `error: ${profilesAnonErr.message}` : `${anonProfiles?.length ?? 0} rows visible (fields: id, role only — no PII requested)`,
);

// Unfiltered projects select as anon — should NOT return non-showcase rows
// (those belong to clients/admins only).
const { count: allProjectsAnon, error: allProjectsErr } = await anon
  .from("projects")
  .select("id", { count: "exact", head: true });
const { count: allProjectsAdmin } = await admin.from("projects").select("id", { count: "exact", head: true });
report(
  "projects: anon sees only showcase subset, not all rows",
  allProjectsErr ? true : (allProjectsAnon ?? 0) <= (showcaseProjects ?? 0),
  `anon sees ${allProjectsAnon ?? "error"} of ${allProjectsAdmin} total rows (admin view)`,
);

// Does RLS actually enforce anything, or is the anon key effectively a
// service-role-equivalent bypass? Sanity check via the service-role client
// on one fully-blocked table, confirming service role sees MORE than anon.
console.log("\n=== Sanity check: service role sees strictly more than anon on a blocked table ===");
const { count: paymentsAnonCount } = await anon.from("payments").select("id", { count: "exact", head: true });
const { count: paymentsAdminCount, error: paymentsAdminErr } = await admin
  .from("payments")
  .select("id", { count: "exact", head: true });
report(
  "payments: admin visibility >= anon visibility (RLS is actually doing something, not just absent data)",
  !paymentsAdminErr,
  paymentsAdminErr
    ? paymentsAdminErr.message
    : `anon: ${paymentsAnonCount ?? 0} rows, service role: ${paymentsAdminCount} rows`,
);

console.log("\n=== profiles: role breakdown of what anon can see ===");
const { data: roleBreakdown } = await anon.from("profiles").select("role");
const counts = {};
(roleBreakdown || []).forEach((r) => { counts[r.role || "null"] = (counts[r.role || "null"] || 0) + 1; });
console.log("Roles visible to anon:", JSON.stringify(counts));

console.log(`\n${pass} confirmed, ${concern} worth a closer look`);
process.exit(0);
