"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/stores/user";
import useDictionary from "@/lib/hooks/useDictionary";
import ErrorMessage from "@/components/ErrorMessage";

export default function RegisterPage() {
  const { dict, lang } = useDictionary();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${lang}`);
    }
  }, [isAuthenticated, lang, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(dict?.register.passwordDontMatch || "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // Note: redirection will be handled by useEffect above
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setError(
          dict?.register.accountExistsError ||
            "An account already exists with this email"
        );
      } else if (code === "auth/weak-password") {
        setError(dict?.register.passwordTooWeek || "Password is too weak");
      } else {
        setError(dict?.register.registrationError || "Registration error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-100">
            {dict?.register.title || "Register user"}
          </h2>
        </div>

        {error && <ErrorMessage error={error} />}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              type="email"
              required
              placeholder={dict?.login.emailPlaceholder || "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="password"
              required
              placeholder={dict?.login.passwordPlaceholder || "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="password"
              required
              placeholder={
                dict?.register.confirmPasswordPlaceholder || "Confirm password"
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-green-600/80 hover:bg-green-700/80 disabled:opacity-50 hover:cursor-pointer"
          >
            {loading ? dict?.loading || "loading" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * 
 * "use client";

import { useDictionary } from "@/lib/hooks/useDictionary";
import { useAuthStore } from "@/lib/stores/user";
import { useEffect, useState } from "react";

export default function ExamsPage() {
  const { dict } = useDictionary();
  const user = useAuthStore((state) => state.user);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      const token = await user?.getIdToken(); // Firebase Auth token
      
      // Usa apolloServerClient o cliente con contexto token
      const { data } = await apolloServerClient.query({
        query: GET_EXAMS,
        context: { token },
      });
      
      setExams(data?.exams || []);
      setLoading(false);
    };

    if (user) fetchExams();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  return <ExamsList exams={exams} />;
}
 */
