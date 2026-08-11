import { SkillCategory, CATEGORY_LABELS } from "@/lib/resume-query-result";

 
interface SkillCategoryTagProps {
  category: SkillCategory | null;
}
 
export function SkillCategoryTag({ category }: SkillCategoryTagProps) {
  if (!category) return null;
 
  return (
    <div className="mt-1 bg-secondary px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-wide text-on-secondary">
      {CATEGORY_LABELS[category]}
    </div>
  );
}