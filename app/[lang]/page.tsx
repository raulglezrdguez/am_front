import type { Lang } from "@/types/languages";
import { getDictionary } from "./dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans text-white">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <p>
          {dict.metadata.description} {dict.metadata.description}{" "}
          {dict.metadata.description} {dict.metadata.description}
        </p>
      </main>
    </div>
  );
}
