import type { Category } from "@/types/category.types";
import categoriesData from "@/data/categories.json";

const CATEGORIES: Category[] = categoriesData as Category[];

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES.map((c) => ({ ...c }));
}

export type CategoryFilterOption = { value: string; label: string };

/** Values align with `Product.category` slugs; includes synthetic `all`. */
export function listCategoryFilterOptions(): CategoryFilterOption[] {
  return [{ value: "all", label: "All categories" }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))];
}
