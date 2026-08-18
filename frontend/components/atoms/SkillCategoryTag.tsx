import Badge from "@/components/atoms/Badge";
import { SkillCategory, CATEGORY_LABELS } from "@/lib/resume-query-result";

interface SkillCategoryTagProps {
  category: SkillCategory | null;
  className?: string;
}

export function SkillCategoryTag({ category, className }: SkillCategoryTagProps) {
  if (!category) return null;

  return (
    <Badge className={['mt-1 px-1 py-0.5 text-[8px] uppercase tracking-wide', className].filter(Boolean).join(' ')}>
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}
