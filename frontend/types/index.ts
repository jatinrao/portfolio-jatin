export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeroStat {
  number: string;
  label: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  number: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  githubUrl?: string;
  demoUrl?: string;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
}

export interface SocialLink {
  icon: string;
  href: string;
  label: string;
}