"use client";
import { LangId, localize } from "@/lib/locale";


import { useState } from "react";

export default function ConnectChannels({ channels, locale }: { channels: any; locale: LangId }) {
  const [hovered, setHovered] = useState<any>(null);

  return (
    <section className="ml-0 relative">
      <div className="border-b border-outline pb-2 mb-2 flex items-center justify-between">
        <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-tighter flex items-center gap-2 text-md">
          CONNECT  <span className="font-label-caps text-md text-on-surface uppercase  tracking-tighter transition-opacity duration-150">
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
            className="group flex items-center justify-center w-12 h-12 border border-primary bg-transparent hover:bg-surface-container transition-colors brutalist-btn-container"
          >
            <div className="hidden group-hover:block !top-1 !left-1 opacity-50" />

            <div className="flex items-center justify-center w-full h-full bg-transparent z-10">
              <span
                dangerouslySetInnerHTML={{ __html: channel.icon.svg }}
                className=" text-primary"
                aria-label={localize(channel.label,locale)}
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}