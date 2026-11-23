"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import Particles from "@/components/Particles";

const LazyParticles = dynamic(() => import("@/components/Particles"), {
  ssr: false,
});

export default function ParticlesBackground(
  props: ComponentProps<typeof Particles>,
) {
  return <LazyParticles {...props} />;
}
