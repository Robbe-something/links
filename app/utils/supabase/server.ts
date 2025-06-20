import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import {Database} from "@/utils/supabase/supabase";

export const createClient = async (cookieStore?: Awaited<ReturnType<typeof cookies>>) => {

    if (!cookieStore) {
        cookieStore = await cookies();
    }

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        const cookies = cookieStore;
                        cookiesToSet.forEach(({ name, value, options }) => cookies.set(name, value, options))
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};
