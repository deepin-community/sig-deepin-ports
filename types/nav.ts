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
  target?: string;
  targets?: NavItem[];
};

export { NavType };
export type { Nav };
