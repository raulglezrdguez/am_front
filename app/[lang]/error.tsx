"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-sm text-gray-400">{error.message}</p>
      <button onClick={reset} className="rounded bg-green-700 px-4 py-2">
        Try again
      </button>
    </div>
  );
}
