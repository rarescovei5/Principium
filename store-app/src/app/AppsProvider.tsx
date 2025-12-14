import { App, DownloadedApp } from '@/types';
import { BaseDirectory, readDir, readFile } from '@tauri-apps/plugin-fs';
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

  
  React.useEffect(() => {
    let fetchApps = async () => {
      try {
        let response = await fetch(
          'https://raw.githubusercontent.com/rarescovei5/principium_app_infos/main/apps.json'
        );
        let data = await response.json();
        setApps(data);
      } catch (error) {
        console.error('Error retrieving app info:', error);
      }
    };

    let retrieveDownloadedApps = async () => {
      try {
        let downloadedAppsDir: Awaited<ReturnType<typeof readDir>> = [];
        try {
          downloadedAppsDir = await readDir('', { baseDir: BaseDirectory.AppData });
        } catch (err) {
          downloadedAppsDir = [];
        }

        const downloadedApps: DownloadedApp[] = [];

        for (const entry of downloadedAppsDir) {
          if (!entry.isFile || !entry.name.endsWith('_app.json')) continue;

          try {
            const file = await readFile(entry.name, {
              baseDir: BaseDirectory.AppData,
            });

            const json = new TextDecoder().decode(file);
            const appData: DownloadedApp = JSON.parse(json);

            downloadedApps.push(appData);
          } catch (err) {
            console.warn(`Failed to load app data for ${entry.name}:`, err);
          }
        }

        setDownloadedApps(downloadedApps);
      } catch (error) {
        console.error('Error retrieving downloaded apps:', error);
      }
    };

    const initializeApp = async () => {
      await Promise.all([fetchApps(), retrieveDownloadedApps()]);
    };

    initializeApp();
  }, []);

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
