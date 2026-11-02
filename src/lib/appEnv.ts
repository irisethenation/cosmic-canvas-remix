import { supabase } from "@/integrations/supabase/client";
import { getPaddleEnvironment } from "@/lib/paddle";

// Tell the database which payment environment this client is in, so RLS
// entitlement checks (lessons, courses, modules) only honor purchases and
// subscriptions from the matching environment. The server defaults to
// 'live' when the header is absent, so a missing header can never widen
// access in production.
const headers = (supabase as unknown as { rest: { headers: Record<string, string> } }).rest.headers;
headers["x-app-env"] = getPaddleEnvironment();
