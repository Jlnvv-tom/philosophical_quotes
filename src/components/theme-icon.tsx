import {
  Bird,
  CircleUser,
  Compass,
  Heart,
  Hourglass,
  Moon,
  Mountain,
  MoveRight,
  Scale,
  Sun,
  Sunrise,
  Telescope,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sunrise,
  Bird,
  Sun,
  Telescope,
  Scale,
  Hourglass,
  Mountain,
  CircleUser,
  Heart,
  Compass,
  MoveRight,
  Moon,
};

export function ThemeIcon({
  name,
  className,
  strokeWidth = 1.25,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = iconMap[name] ?? Compass;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
