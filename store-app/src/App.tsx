import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DiscoverPage from './pages/DiscoverPage';
import DownloadPage from './pages/DownloadPage';
import LibraryPage from './pages/LibraryPage';
import AppPage from './pages/AppPage';
import { useApps } from './app/AppsProvider';
import * as React from 'react';

import { BaseDirectory, readDir, readFile } from '@tauri-apps/plugin-fs';
import { DownloadedApp } from './types';

function App() {
  const { setApps, setDownloadedApps } = useApps();

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
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/apps/:appName" element={<AppPage />} />
          <Route path="/downloads" element={<DownloadPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
