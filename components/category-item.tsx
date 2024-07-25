"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

type CategoryItemProp = {
  label: string;
  value?: number;
};

export const CategoryItem = ({ label, value }: CategoryItemProp) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = Number(currentCategoryId) === value;

  const onClick = () => {
    const newQuery = {
      title: currentTitle,
      categoryId: isSelected ? undefined : value,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: newQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );
    console.log(currentTitle);
    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 dark:border-bg2-contrast rounded-full flex items-center gap-x-1 hover:bg-slate-100 dark:hover:bg-hover-dark dark:hover:text-background-2nd-level hover:border-primary transition",
        isSelected && " bg-primary text-primary-foreground"
      )}
      type="button"
    >
      <div className="truncate">{label}</div>
    </button>
  );
};
