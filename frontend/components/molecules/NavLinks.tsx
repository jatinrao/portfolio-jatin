import { NavLink } from "@/types";

interface NavLinksProps {
  links: NavLink[];
}

export default function NavLinks({ links }: NavLinksProps) {
  return (
    <div className="flex gap-8 items-center">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={`text-sm font-medium tracking-[0.5px] pb-[2px] border-b-2 transition-colors duration-200 cursor-pointer
            ${
              link.active
                ? "text-[#e8c96a] border-[#e8c96a]"
                : "text-white/75 border-transparent hover:text-white"
            }`}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}