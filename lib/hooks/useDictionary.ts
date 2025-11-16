"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Dictionary, Lang } from "@/types/languages";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default function useDictionary() {
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();

  useEffect(() => {
    let mounted = true;

    const load = async (lang: Lang) => {
      try {
        setLoading(true);
        const d = await getDictionary(lang);
        if (!mounted) return;
        setDict(d);
        setLang(lang);
      } catch (err) {
        console.error("Error loading dictionary:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const lang = params?.lang as Lang | undefined;
    if (lang) {
      load(lang);
    } else {
      load("en");
    }

    return () => {
      mounted = false;
    };
  }, [params]);

  return { dict, loading, lang } as const;
}
