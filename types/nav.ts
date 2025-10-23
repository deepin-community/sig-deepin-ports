type Nav = NavItem[];

enum NavType {
  Internal = "internal",
  Group = "group",
  External = "external",
  Subtitle = "subtitle",
}

type NavItem = {
  title: string;
  type: NavType;
  target?: string | undefined;
  targets?: NavItem[] | undefined;
};

export { NavType };
export type { Nav };
