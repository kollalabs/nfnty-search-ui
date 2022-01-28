type MenuLink = {
  displayName: string;
  url: string;
};

const menuUserLinks = [
  { displayName: 'Search', url: '/search' },
  { displayName: 'Connections', url: '/connections' },
  { displayName: 'Logout', url: '/logout' },
] as MenuLink[];

const menuUnauthedLinked = [{ displayName: 'Login', url: '/login' }] as MenuLink[];

export { menuUserLinks, menuUnauthedLinked };
export type { MenuLink };
