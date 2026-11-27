import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/explorer", "/journal", "/chapters"];
const AUTH_ONLY_PREFIXES = ["/login", "/explorer/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Penting: refresh sesi & validasi token di server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthOnlyRoute = AUTH_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Kecualikan /explorer/register dari pengecekan protected route agar user baru tetap bisa daftar
  const isProtectedRoute =
    !isAuthOnlyRoute &&
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  // 1. Belum login tapi mencoba akses /explorer, /journal, atau /chapters -> lempar ke /login
  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Sudah login tapi membuka /login atau /explorer/register -> langsung ke /explorer
  if (user && isAuthOnlyRoute) {
    const hubUrl = request.nextUrl.clone();
    hubUrl.pathname = "/explorer";
    hubUrl.search = "";
    return NextResponse.redirect(hubUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|videos|audio|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3)$).*)",
  ],
};
