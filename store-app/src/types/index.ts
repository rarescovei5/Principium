export interface LibraryApp {
  image: string;
  name: string;
  author: string;
  type: string;
  date: string;
  id: string;
  repositoryUrl: string;
}

export interface DiscoverApp {
  image: string;
  name: string;
  id: string;
  category: string;
}

export interface App {
  name:string;
  author:string;
  description:string;
  screenshots:string[];
  categories:string[];
}