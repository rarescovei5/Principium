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
  appIcon: string; // the icon of the app
  name: string;
  author: string;
  type: string; // the type of the app (cli or app)
  repoUrl: string;
  dateAdded: string; // the date when the app was downloaded
  tagName: string; // the tag when the app was downloaded
}