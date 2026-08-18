"use client";
import { LangId, localize } from "@/lib/locale";


import { useState } from "react";

export default function ConnectChannels({ channels, locale }: { channels: any; locale: LangId }) {
  const [hovered, setHovered] = useState<any>(null);

  return (
    <section className="ml-0 relative">
      <div className="mb-2 flex items-center justify-between border-b border-outline-variant pb-2">
        <p className="flex items-center gap-2 font-label-caps text-label-caps uppercase text-muted-body">
          CONNECT
          <span className="font-label-caps text-label-caps uppercase text-heading-ink transition-opacity duration-[var(--transition-fast)] ease-[var(--ease-standard)]">
            {hovered ? `via ${hovered.label}` : ""}
          </span>
        </p>

        {/* Fixed-position label, always in the same spot */}
       
      </div>

      <div className="flex flex-wrap gap-4">
        {channels.map((channel: any) => (
          <a
            key={localize(channel.label,locale)}
            href={channel.url}
            onMouseEnter={() => setHovered(channel)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(channel)}
            onBlur={() => setHovered(null)}
            className="group flex h-12 w-12 items-center justify-center rounded-[var(--radius-control)] border border-outline-variant bg-transparent shadow-[var(--shadow-card-resting)] transition-[background-color,box-shadow,border-color] duration-[var(--transition-fast)] ease-[var(--ease-standard)] hover:border-primary hover:bg-primary-container hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="hidden group-hover:block !top-1 !left-1 opacity-50" />

            <div className="flex items-center justify-center w-full h-full bg-transparent z-10">
              <span
                dangerouslySetInnerHTML={{ __html: channel.icon.svg }}
                className="text-secondary [&_svg]:fill-current"
                aria-label={localize(channel.label,locale)}
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}