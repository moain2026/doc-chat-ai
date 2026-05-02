import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/formatters";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const dotSizeMap: Record<AvatarSize, string> = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-4 w-4",
};

export const Avatar = ({ name = "", src, size = "md", online, className }: AvatarProps) => (
  <div className={cn("relative flex-shrink-0", className)}>
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold overflow-hidden",
        "bg-gradient-to-br from-indigo-500 to-violet-600 text-white",
        sizeMap[size]
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name || "U")}</span>
      )}
    </div>
    {online && (
      <span
        className={cn(
          "absolute bottom-0 right-0 rounded-full bg-emerald-500 border-2 border-background",
          dotSizeMap[size]
        )}
      />
    )}
  </div>
);
