"use server";

import { redirect } from "next/navigation";

export default async function Page() {
  // Redirect root to default language
  redirect("/en");
}
