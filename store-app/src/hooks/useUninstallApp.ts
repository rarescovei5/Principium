import { useApps } from '@/app/AppsProvider';
import { safeSegment } from '@/lib/safeSegment';
import type { DownloadedApp } from '@/types';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import * as React from 'react';

export function useUninstallApp(params: { downloadedApp: DownloadedApp }) {
  const { downloadedApp } = params;
  const { setDownloadedApps } = useApps();
  const [isUninstalling, setIsUninstalling] = React.useState(false);

  const uninstallApp = React.useCallback(async () => {
    setIsUninstalling(true);
    try {
      const appDir = await appDataDir();
      await invoke('uninstall_app', { appDir, appName: safeSegment(downloadedApp.name.toLowerCase()) });
      setDownloadedApps((prev) => prev.filter((a) => a.name !== downloadedApp.name));
    } finally {
      setIsUninstalling(false);
    }
  }, [downloadedApp.name, setDownloadedApps]);

  return { isUninstalling, uninstallApp };
}


