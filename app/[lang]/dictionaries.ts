import type { Dictionary, Lang } from "@/types/languages";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
  it: () => import("@/dictionaries/it.json").then((module) => module.default),
  de: () => import("@/dictionaries/de.json").then((module) => module.default),
};

export const getDictionary = async (locale: Lang): Promise<Dictionary> => {
  const loader = dictionaries[locale] ?? dictionaries.en;
  return (await loader()) as Dictionary;
};
