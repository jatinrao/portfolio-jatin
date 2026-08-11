import Icon from "@/components/atoms/Icon";

interface NavLogoProps {
  firstName: string;
  lastName: string;
}

export default function NavLogo({ firstName, lastName }: NavLogoProps) {
  return (
    <div className="flex items-center gap-[10px] text-[20px] font-extrabold tracking-[1px] text-white cursor-pointer">
      <div className="w-9 h-9 bg-[#c9a84c] rounded-[4px] flex items-center justify-center">
        <Icon name="Code2" size={20} color="#1a1a1a" />
      </div>
      {firstName} <span className="text-[#e8c96a]">{lastName}</span>
    </div>
  );
}