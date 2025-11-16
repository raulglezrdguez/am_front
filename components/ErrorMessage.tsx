export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
      {error}
    </div>
  );
}
