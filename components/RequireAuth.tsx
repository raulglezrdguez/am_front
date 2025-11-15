"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/user";

export default function RequireAuth({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow unauthenticated access to login and register
    const loginPath = `/${lang}/login`;
    const registerPath = `/${lang}/register`;

    if (!pathname) return;

    const isAuthRoute = [loginPath, registerPath].includes(pathname); // pathname === loginPath || pathname === registerPath;

    if (!isAuthenticated && !isAuthRoute) {
      // redirect to login preserving query
      router.replace(loginPath);
    }
  }, [isAuthenticated, pathname, router, lang]);

  return <>{children}</>;
}
