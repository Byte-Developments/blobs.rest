"use client";

import dynamic from "next/dynamic";

const NebulaScene = dynamic(() => import("@/components/NebulaScene"), {
  ssr: false,
});

export default function Page() {
  return <NebulaScene />;
}
