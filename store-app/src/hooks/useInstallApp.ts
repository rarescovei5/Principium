import { useApps } from '@/app/AppsProvider';
import { safeSegment } from '@/lib/safeSegment';
import type { App, DownloadedApp } from '@/types';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';
import { writeFile } from '@tauri-apps/plugin-fs';
import * as React from 'react';

export function useInstallApp(params: { app?: App; appName?: string }) {
  const { app, appName } = params;
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { downloadedApps, setDownloadedApps } = useApps();

  const installApp = React.useCallback(async () => {
    setIsDownloading(true);
    if (!app || !appName) {
      setIsDownloading(false);
      return;
    }

    // Check if the app is already downloaded and the tag is the same
    if (
      downloadedApps.find(
        (a) => a.name === appName && a.tagName === app.latestRelease.tagName
      )
    ) {
      setIsDownloading(false);
      return;
    }

    try {
      const downloadUrl = app.latestRelease?.downloadLink;
      if (!downloadUrl) throw new Error('Missing latestRelease.downloadLink');

      // Extract filename from URL
      const filename = `${safeSegment(app.name.toLowerCase())}.exe`;

      // Call Tauri command to download file natively
      const dirPath = await appDataDir();
      await invoke('download_app', { appDir: dirPath, url: downloadUrl, filename });

      // Minimal PATH behavior: if we just downloaded an .exe into appDataDir(),
      // ensure the app's data directory is on the user's PATH (Windows only).
      if (filename.toLowerCase().endsWith('.exe')) {
        await invoke('ensure_dir_on_user_path', { dir: dirPath });
      }

      // Save metadata (app.json)
      const downloaded: DownloadedApp = {
        appIcon: app.appIcon,
        name: app.name,
        author: app.author,
        type: app.type,
        repoUrl: app.repoUrl,
        dateAdded: new Date().toISOString(),
        tagName: app.latestRelease.tagName,
      };

      const appJsonPath = await join(
        dirPath,
        `${safeSegment(app.name.toLowerCase())}_app.json`
      );
      const jsonBytes = new TextEncoder().encode(JSON.stringify(downloaded, null, 2));
      await writeFile(appJsonPath, jsonBytes);

      // Since we can use this util for both installing and updating, we need to make sure we don't create duplicates
      setDownloadedApps((prev) => {
        const existingApp = prev.findIndex((a) => a.name === appName);
        const newDownloadedApps = [...prev];
        if (existingApp !== -1) {
          newDownloadedApps[existingApp] = downloaded;
        } else {
          newDownloadedApps.push(downloaded);
        }
        return newDownloadedApps;
      });
    } catch (err) {
      console.error('Failed to install app:', err);
    } finally {
      setIsDownloading(false);
    }
  }, [app, appName, downloadedApps, setDownloadedApps]);

  return { isDownloading, installApp };
}
