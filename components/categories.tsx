"use client";
import { EventType } from "@prisma/client";

import { CategoryItem } from "./category-item";

type CategoriesProps = {
  items: EventType[];
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem key={item.id} label={item.name} value={item.id} />
      ))}
    </div>
  );
};
