import { PortableText } from "@portabletext/react";
import { SectionComponentProps } from "@/lib/section";

export function RichTextSection({ section }: SectionComponentProps<undefined>) {
  if (!section.content) return null;
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableText value={section.content as any} />
    </div>
  );
}