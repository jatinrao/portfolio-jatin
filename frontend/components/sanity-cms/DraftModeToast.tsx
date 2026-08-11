"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { disableDraftMode } from "@/app/actions";

export default function DraftModeToast() {
  const isPresentationTool = useIsPresentationTool();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // Only show the toast if we are NOT inside the Sanity Studio Presentation Tool iframe
    if (isPresentationTool === false) {
      const toastId = toast("Draft Mode Enabled", {
        description: "Viewing draft content. Disabling will switch to published content.",
        duration: Infinity,
        action: {
          label: "Disable",
          onClick: () =>
            startTransition(async () => {
              await disableDraftMode();
              startTransition(() => router.refresh());
            }),
        },
      });
      
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [router, isPresentationTool]);

  useEffect(() => {
    if (pending) {
      const toastId = toast.loading("Disabling draft mode...");
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [pending]);

  return null;
}
