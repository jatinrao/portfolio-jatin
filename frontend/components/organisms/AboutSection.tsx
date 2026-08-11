import SectionLabel from "@/components/atoms/SectionLabel";
import SectionTitle from "@/components/atoms/SectionTitle";
import SkillCategory from "@/components/molecules/SkillCategory";
import { SkillCategory as SkillCategoryType } from "@/types";

const skillCategories: SkillCategoryType[] = [
  {
    title: "Frontend",
    skills: ["JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL", "REST APIs"],
  },
  {
    title: "Tools & Deployment",
    skills: ["Git & GitHub", "Docker", "Figma", "Vercel", "AWS", "Jest"],
  },
];

export default function AboutSection() {
  return (
    <div id="about" className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid grid-cols-2 gap-20 items-start">
          {/* About text */}
          <div>
            <SectionLabel>Who I Am</SectionLabel>
            <SectionTitle>About Me</SectionTitle>
            <div className="flex flex-col gap-5 text-base text-[#3a3a3a] leading-[1.8]">
              <p>
                Hello! My name is Jatin and I enjoy creating things that live
                on the internet. My interest in web development started back
                when I decided to try editing custom templates — turns out
                hacking together HTML &amp; CSS taught me a lot about
                architecture and design!
              </p>
              <p>
                Fast-forward to today, and I've had the privilege of working at
                an advertising agency, a start-up, and a massive product
                studio. My main focus these days is building accessible,
                inclusive products and digital experiences at scale.
              </p>
              <div className="bg-[#2d5a3d] text-white rounded-[6px] px-6 py-5 mt-2 border-l-4 border-[#c9a84c] text-[15px] leading-[1.6]">
                When I'm not at the computer, I'm usually{" "}
                <strong className="text-[#e8c96a]">
                  exploring new tech trends
                </strong>
                , reading about design systems, or{" "}
                <strong className="text-[#e8c96a]">
                  contributing to open-source software
                </strong>
                .
              </div>
            </div>
          </div>

          {/* Skills */}
          <div id="skills" className="flex flex-col gap-8">
            <div>
              <SectionLabel>What I Use</SectionLabel>
              <SectionTitle>Technical Skills</SectionTitle>
            </div>
            <div className="flex flex-col gap-4 -mt-6">
              {skillCategories.map((cat) => (
                <SkillCategory key={cat.title} {...cat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}