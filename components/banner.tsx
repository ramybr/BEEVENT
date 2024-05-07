import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCheckIcon, CheckCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const banneraVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof banneraVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(banneraVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
      <div></div>
    </div>
  );
};
