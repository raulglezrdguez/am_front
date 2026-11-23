import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-3xl font-bold">404</h1>
      <Link href="/" className="text-green-400 hover:underline">
        Go home
      </Link>
    </div>
  );
}
