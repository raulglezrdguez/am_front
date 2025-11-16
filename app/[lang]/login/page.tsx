"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/stores/user";
import useDictionary from "@/lib/hooks/useDictionary";

export default function LoginPage() {
  const { dict, lang } = useDictionary();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuthStore();

  const [signInWithGoogle] = useSignInWithGoogle(auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${lang}`);
    }
  }, [isAuthenticated, router, lang]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError(dict?.login.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
    } catch {
      setError(dict?.login.googleLoginError || "Error signing in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-100">
            {dict?.login.title || "Login"}
          </h2>
        </div>

        {error && (
          <div className="bg-white/80 border border-red-200 text-red-700 font-light px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="email"
              type="email"
              required
              placeholder={dict?.login.emailPlaceholder || "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <input
              id="password"
              type="password"
              required
              placeholder={dict?.login.passwordPlaceholder || "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-green-600/80 hover:bg-green-700/80 disabled:opacity-50 hover:cursor-pointer"
          >
            {loading
              ? dict?.loading || "loading"
              : dict?.login.emailLoginButton || "Login"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-300">
          <span>
            {dict?.login.noAccountText || "Don't have an account?"}{" "}
            <Link
              href={`/${(lang as string) || "en"}/register`}
              className="text-green-400 hover:underline"
            >
              {dict?.login.registerLinkText || "Register"}
            </Link>
          </span>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              {dict?.login.orLoginWith || "Or"}
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white/80 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 hover:cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {dict?.login.googleLoginButton || "Login"}
        </button>
      </div>
    </div>
  );
}
