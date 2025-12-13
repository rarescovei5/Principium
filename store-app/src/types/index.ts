export interface App {
  appIcon: string;
  name: string;
  description: string;
  author: string;
  category: string;
  type: string;
  screenshots: string[];
  repoUrl: string;
  latestRelease: {
    tagName: string;
    publishedAt: string;
    downloadLink: string;
  };
}
export type LibraryApp = Pick<App, 'appIcon' | 'name' | 'author' | 'type' | 'repoUrl'> & { dateAdded: string };
export type DiscoverApp = Pick<App, 'appIcon' | 'name' | 'category'>;


export interface DownloadedApp {
  appIcon: string;
  name: string;
  author: string;
  type: string;
  repoUrl: string;
  dateAdded: string;
}