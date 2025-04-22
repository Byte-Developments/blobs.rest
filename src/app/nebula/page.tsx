"use client";

import dynamic from "next/dynamic";

const NebulaScene = dynamic(() => import("@/components/NebulaScene"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <Head>
        <title>visuals rest - nebula</title>
        <meta name="description" content="animated nebula experience with a modern date widget for a calm ambient experience." />
        <meta name="keywords" content="nebula, nebula animtion, relaxing animation, ambient animation" />
      </Head>
      <main>
        <NebulaScene />
      </main>
    </>
  );
}
