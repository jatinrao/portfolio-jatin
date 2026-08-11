import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({ name, size = 16, color, className = "" }: IconProps) {
  const LucideIcon = LucideIcons[name] as React.ComponentType<{
    size?: number;
    color?: string;
    className?: string;
  }>;

  if (!LucideIcon) return null;

  return <LucideIcon size={size} color={color} className={className} />;
}