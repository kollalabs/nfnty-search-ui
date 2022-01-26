type MenuLink = {
  displayName: string;
  url: string;
};

const menuNavLinksHeader = [
  { displayName: 'Docs', url: '/docs' },
  { displayName: 'Tutorials', url: '/tutorials' },
  { displayName: 'My Apps', url: '/apps' },
] as MenuLink[];

const menuNavLinksFooter = [
  { displayName: 'Overview', url: '/overview' },
  { displayName: 'Features', url: '/features' },
  { displayName: 'Pricing', url: '/pricing' },
  { displayName: 'Careers', url: '/careers' },
  { displayName: 'Help', url: '/help' },
  { displayName: 'Privacy', url: '/privacy' },
] as MenuLink[];

const menuUserLinks = [
  { displayName: 'Account', url: '/profile' },
  { displayName: 'Dashboard', url: '/apps' },
  { displayName: 'Logout', url: '/logout' },
] as MenuLink[];

const menuUnauthedLinked = [
  { displayName: 'Login', url: '/login' },
] as MenuLink[];

export {
  menuNavLinksHeader,
  menuNavLinksFooter,
  menuUserLinks,
  menuUnauthedLinked,
};
export type { MenuLink };
