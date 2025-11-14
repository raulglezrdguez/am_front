"use server";

import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  // If the request contains OAuth/Firebase callback params, do not redirect so the
  // callback can be handled by the client (middleware also skips redirects for these).
  const oauthParams = [
    "state",
    "code",
    "error",
    "oauth_token",
    "firebaseError",
  ];
  if (searchParams) {
    for (const p of oauthParams) {
      if (Object.prototype.hasOwnProperty.call(searchParams, p)) {
        // render an empty page (do not redirect) so the callback params reach the client
        return null;
      }
    }
  }

  // Redirect root to default language when not handling an OAuth callback
  redirect("/en");
}
