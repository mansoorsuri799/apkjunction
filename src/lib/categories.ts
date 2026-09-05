import type { WPCategory } from "@/types/wordpress";
import { getCategories } from "@/lib/wordpress";

export type CategoryLink = {
  name: string;
  slug: string;
  href: string;
  count?: number;
  id?: number;
};

export type CategoryGroup = {
  name: string;
  slug: string;
  href: string;
  children: CategoryLink[];
};

const APP_CHILDREN: Array<{ name: string; slug: string }> = [
  { name: "Communication", slug: "communication" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Social", slug: "social" },
  { name: "WhatsApp MODs", slug: "whatsapp-mods" },
  { name: "Manga", slug: "manga" },
  { name: "Photography", slug: "photography" },
  { name: "Music", slug: "music" },
  { name: "Personalization", slug: "personalization" },
  { name: "Sports", slug: "sports" },
  { name: "VPN", slug: "vpn" },
  { name: "Tools", slug: "tools" },
  { name: "Education", slug: "education" },
  { name: "Finance", slug: "finance" },
  { name: "Shopping", slug: "shopping" },
];

/** Keep Casino under Games and Music under Apps only. */
const HIDDEN_CHILDREN: Record<string, Set<string>> = {
  apps: new Set(["casino"]),
  games: new Set(["music-games", "music"]),
};

function isHiddenChild(parentSlug: string, wpSlug: string): boolean {
  const hidden = HIDDEN_CHILDREN[parentSlug];
  if (!hidden) return false;
  return hidden.has(wpSlug) || hidden.has(categoryPathSegment(wpSlug, parentSlug));
}

const GAME_CHILDREN: Array<{ name: string; slug: string }> = [
  { name: "Action", slug: "action" },
  { name: "Racing", slug: "racing" },
  { name: "Simulation", slug: "simulation" },
  { name: "Casual", slug: "casual" },
  { name: "Casino", slug: "casino-games" },
  { name: "Sports", slug: "sports-games" },
  { name: "Strategy", slug: "strategy" },
  { name: "Arcade", slug: "arcade" },
  { name: "Role Playing", slug: "role-playing" },
  { name: "Trivia", slug: "trivia" },
  { name: "Adventure", slug: "adventure" },
  { name: "Card", slug: "card" },
  { name: "Board", slug: "board" },
  { name: "Shooting", slug: "shooting" },
  { name: "Puzzle", slug: "puzzle" },
];

/** Public URL segment. Games that share a name with apps use a -games WP slug. */
export function categoryPathSegment(wpSlug: string, parentSlug: string): string {
  if (parentSlug === "games" && wpSlug.endsWith("-games")) {
    return wpSlug.slice(0, -6);
  }
  return wpSlug;
}

export function categoryHref(parentSlug: string, childWpSlug?: string): string {
  if (!childWpSlug) return `/${parentSlug}`;
  return `/${parentSlug}/${categoryPathSegment(childWpSlug, parentSlug)}`;
}

function toLink(
  name: string,
  slug: string,
  parentSlug: string,
  count?: number,
  id?: number
): CategoryLink {
  return {
    name,
    slug,
    href: categoryHref(parentSlug, slug),
    count,
    id,
  };
}

export const FALLBACK_CATEGORY_TREE: CategoryGroup[] = [
  {
    name: "Apps",
    slug: "apps",
    href: categoryHref("apps"),
    children: APP_CHILDREN.map((item) => toLink(item.name, item.slug, "apps")),
  },
  {
    name: "Games",
    slug: "games",
    href: categoryHref("games"),
    children: GAME_CHILDREN.map((item) => toLink(item.name, item.slug, "games")),
  },
];

function flattenCatalog(): CategoryLink[] {
  return FALLBACK_CATEGORY_TREE.flatMap((group) => [
    { name: group.name, slug: group.slug, href: group.href },
    ...group.children,
  ]);
}

export function findCatalogCategory(slug: string): {
  entry: CategoryLink;
  parent?: CategoryGroup;
  group?: CategoryGroup;
} | null {
  for (const group of FALLBACK_CATEGORY_TREE) {
    if (group.slug === slug) {
      return { entry: group, group };
    }
    const child = group.children.find(
      (item) =>
        item.slug === slug ||
        categoryPathSegment(item.slug, group.slug) === slug
    );
    if (child) {
      return { entry: child, parent: group };
    }
  }
  return null;
}

export function findCatalogChild(
  parentSlug: string,
  pathSlug: string
): CategoryLink | null {
  const group = FALLBACK_CATEGORY_TREE.find((item) => item.slug === parentSlug);
  if (!group) return null;
  return (
    group.children.find(
      (item) =>
        item.slug === pathSlug ||
        categoryPathSegment(item.slug, parentSlug) === pathSlug
    ) ?? null
  );
}

export function getChildPathSlugs(parentSlug: string): string[] {
  const group = FALLBACK_CATEGORY_TREE.find((item) => item.slug === parentSlug);
  if (!group) return [];
  return group.children.map((item) => categoryPathSegment(item.slug, parentSlug));
}

export function getAllCategoryHrefs(
  tree: CategoryGroup[] = FALLBACK_CATEGORY_TREE
): string[] {
  return tree.flatMap((group) => [group.href, ...group.children.map((child) => child.href)]);
}

function sortLikeFallback(
  children: CategoryLink[],
  fallback: Array<{ slug: string }>
): CategoryLink[] {
  const order = new Map(fallback.map((item, index) => [item.slug, index]));
  return [...children].sort((a, b) => {
    const aOrder = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });
}

function groupFromWordpress(
  categories: WPCategory[],
  parentSlug: string,
  fallbackChildren: Array<{ name: string; slug: string }>
): CategoryGroup | null {
  const parent = categories.find(
    (category) =>
      category.slug === parentSlug ||
      category.name.toLowerCase() === parentSlug
  );
  if (!parent) return null;

  const children = categories
    .filter(
      (category) =>
        category.parent === parent.id &&
        !isHiddenChild(parentSlug, category.slug)
    )
    .map((category) =>
      toLink(category.name, category.slug, parentSlug, category.count, category.id)
    );

  return {
    name: parent.name,
    slug: parent.slug,
    href: categoryHref(parentSlug),
    children: children.length
      ? sortLikeFallback(children, fallbackChildren)
      : fallbackChildren.map((item) => toLink(item.name, item.slug, parentSlug)),
  };
}

export async function getCategoryTree(): Promise<CategoryGroup[]> {
  try {
    const categories = await getCategories();
    const apps = groupFromWordpress(categories, "apps", APP_CHILDREN);
    const games = groupFromWordpress(categories, "games", GAME_CHILDREN);

    if (apps || games) {
      return [
        apps ?? FALLBACK_CATEGORY_TREE[0],
        games ?? FALLBACK_CATEGORY_TREE[1],
      ];
    }
  } catch (error) {
    console.error("[categories] WordPress tree failed:", error);
  }

  return FALLBACK_CATEGORY_TREE;
}

export function getAllCategorySlugs(tree: CategoryGroup[] = FALLBACK_CATEGORY_TREE): string[] {
  return tree.flatMap((group) => [group.slug, ...group.children.map((child) => child.slug)]);
}

export function catalogHasSlug(slug: string): boolean {
  return flattenCatalog().some((item) => item.slug === slug);
}

export function resolvePostCatalogTrail(
  categories: Array<{ slug: string; name?: string }>
): { parent?: CategoryGroup; child?: CategoryLink } {
  let parent: CategoryGroup | undefined;
  let child: CategoryLink | undefined;

  for (const category of categories) {
    const match =
      findCatalogCategory(category.slug) ||
      (category.name
        ? findCatalogCategory(category.name.toLowerCase())
        : null);
    if (!match) continue;
    if (match.parent) {
      return { parent: match.parent, child: match.entry };
    }
    if (match.group) {
      parent = match.group;
    }
  }

  return { parent, child };
}

export function buildPostCatalogCrumbs(
  categories: Array<{ slug: string; name?: string }>,
  postSlug: string
): Array<{ label: string; href?: string }> {
  const { parent, child } = resolvePostCatalogTrail(categories);
  const crumbs: Array<{ label: string; href?: string }> = [];
  if (parent) crumbs.push({ label: parent.name, href: parent.href });
  if (child) crumbs.push({ label: child.name, href: child.href });
  crumbs.push({ label: postSlug, href: `/${postSlug}` });
  return crumbs;
}
