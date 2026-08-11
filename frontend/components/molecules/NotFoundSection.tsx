import type { SectionComponentProps } from "@/lib/section";

export function NotFoundSection({ section }: SectionComponentProps<undefined>) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="rounded-md border border-dashed border-red-400 p-4 text-sm text-red-500">
        No component registered for sectionType: <code>{section.sectionType}</code>
      </div>
    );
  }
  return null; // silently omit in production rather than show a dev warning to visitors
}