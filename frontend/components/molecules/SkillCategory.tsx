import Badge from "@/components/atoms/Badge";
import { SkillCategory as SkillCategoryType } from "@/types";

export default function SkillCategory({ title, skills }: SkillCategoryType) {
  return (
    <div className="flex flex-col gap-3 bg-white border border-[#c9a84c] border-t-[3px] border-t-[#2d5a3d] rounded-[6px] p-5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-[#2d5a3d] uppercase tracking-[1.5px] after:content-[''] after:flex-1 after:h-px after:bg-[#c9a84c]/50">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
    </div>
  );
}