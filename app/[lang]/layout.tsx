import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Particles from "@/components/Particles";
import type { Lang } from "@/types/languages";
import { getDictionary } from "./dictionaries";
import Header from "@/components/Header";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return {
    title: "Sharexam",
    description:
      dict.metadata.description || "Professional community for sharing exams",
    alternates: {
      canonical: "/",
      languages: {
        [lang]: `/${lang}`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: Lang }> }>) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Particles
          particleColors={["#008000"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          className="bg-black"
        />

        <AuthProvider>
          <div className="relative z-10 text-white">
            {<Header />}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
