import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Only access document in browser environment
          if (typeof document === 'undefined') return undefined;
          
          // Read cookies from document.cookie
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
          }
          return undefined;
        },
        set(name: string, value: string, options: any) {
          // Only access document in browser environment
          if (typeof document === 'undefined') return;
          
          // Set cookies using document.cookie
          let cookie = `${name}=${value}`;
          if (options?.maxAge) {
            cookie += `; max-age=${options.maxAge}`;
          }
          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          if (options?.sameSite) {
            cookie += `; samesite=${options.sameSite}`;
          }
          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          // Only access document in browser environment
          if (typeof document === 'undefined') return;
          
          // Remove cookies by setting max-age to 0
          let cookie = `${name}=; max-age=0`;
          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          document.cookie = cookie;
        },
      },
    }
  );
}
