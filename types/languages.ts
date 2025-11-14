export type Lang = "en" | "es" | "fr" | "it" | "de";

export const SUPPORTED_LOCALES = ["en", "es", "fr", "it", "de"] as const;

export type Dictionary = {
  metadata: {
    description: string;
  };
  header: {
    exam: string;
    patient: string;
    stat: string;
    auth: string;
    closeSession: string;
  };
  login: {
    title: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    emailLoginButton: string;
    orLoginWith: string;
    googleLoginButton: string;
    error: string;
    accountExistsError: string;
    popupBlockedError: string;
    googleLoginError: string;
  };
  loading: string;
};
