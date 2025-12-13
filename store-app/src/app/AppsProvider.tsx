import { App, DownloadedApp } from '@/types';
import * as React from 'react';

interface AppContextType {
  apps: App[];
  setApps: React.Dispatch<React.SetStateAction<App[]>>;
  downloadedApps: DownloadedApp[];
  setDownloadedApps: React.Dispatch<React.SetStateAction<DownloadedApp[]>>;
}
const AppsContext = React.createContext<AppContextType | null>(null);

export const AppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [apps, setApps] = React.useState<App[]>([]);
  const [downloadedApps, setDownloadedApps] = React.useState<DownloadedApp[]>([]);
  return (
    <AppsContext.Provider value={{ apps, setApps, downloadedApps, setDownloadedApps }}>{children}</AppsContext.Provider>
  );
};

export const useApps = () => {
  const context = React.useContext(AppsContext);
  if (!context) {
    throw new Error('useApps must be used within a AppsProvider');
  }
  return context;
};
