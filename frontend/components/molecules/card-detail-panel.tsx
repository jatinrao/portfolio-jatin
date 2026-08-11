"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Artifact } from "@/types/artifact";
import { StatusBadge } from "@/components/atoms/status-badge";

export interface CardDetailPanelProps {
  artifact: Artifact;
  onClose: () => void;
}

/**
 * Opens in landscape orientation (image left, spec sheet right) rather
 * than reusing the portrait card shape — this is a different reading
 * mode, not a bigger version of the same card. Flips in around the Y
 * axis so it reads as the card turning to face the viewer.
 */
export function CardDetailPanel({ artifact, onClose }: CardDetailPanelProps) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`detail-title-${artifact.id}`}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-heading-ink/70 p-margin-mobile md:p-margin-desktop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ rotateY: -90, opacity: 0, scale: 0.92 }}
        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        exit={{ rotateY: 90, opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        style={{ transformPerspective: 1600 }}
        onClick={(event) => event.stopPropagation()}
        className="grid aspect-[16/9] w-full max-w-4xl grid-cols-1 overflow-hidden border-2 border-heading-ink bg-white shadow-[12px_12px_0px_0px_#755b00] md:grid-cols-2"
      >
        <div className="relative hidden h-full w-full md:block">
          <Image src={artifact.imageUrl} alt={artifact.imageAlt} fill sizes="50vw" className="object-cover" />
        </div>

        <div className="flex h-full flex-col justify-between overflow-y-auto p-6 md:p-10">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="mb-1 font-label-caps text-[10px] text-primary">
                  UNIT_{artifact.unitCode}
                </p>
                <h2
                  id={`detail-title-${artifact.id}`}
                  className="font-headline-lg text-xl uppercase tight-heading md:text-2xl"
                >
                  {artifact.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close detail panel"
                className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-heading-ink bg-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
              {artifact.description}
            </p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-outline-variant pt-4">
              {/* {artifact.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="font-label-caps text-[9px] text-muted-body">{metric.label}</dt>
                  <dd className="font-label-caps text-[12px] text-heading-ink">{metric.value}</dd>
                </div>
              ))} */}
            </dl>
          </div>

          <div className="mt-6 flex items-center justify-between border-t-2 border-heading-ink pt-3">
            <span className="font-label-caps text-[10px]">{artifact.series}</span>
            <StatusBadge status={artifact.status} emphasized />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
