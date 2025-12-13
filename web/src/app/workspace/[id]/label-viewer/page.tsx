"use client";

import { useParams } from "next/navigation";
import { LabelViewer } from "@/presentation/components/tools/LabelViewer";
import React from "react";

export default function LabelViewerPage() {
  const params = useParams();
  const workspaceId = params.id as string;

  return (
    <main className="p-6">
      <LabelViewer workspaceId={workspaceId} />
    </main>
  );
}
