import { useApps } from '@/app/AppsProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { safeSegment } from '@/lib/safeSegment';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';
import { writeFile } from '@tauri-apps/plugin-fs';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

const AppPage = () => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { appName } = useParams();
  const { apps, downloadedApps, setDownloadedApps } = useApps();
  const app = apps.find((app) => app.name === appName);

  const installApp = React.useCallback(async () => {
    setIsDownloading(true);
    if (!app || !appName) {
      setIsDownloading(false);
      return;
    }

    if (downloadedApps.find((a) => a.name === appName)) {
      setIsDownloading(false);
      return;
    }

    try {
      const downloadUrl = app.latestRelease?.downloadLink;
      if (!downloadUrl) throw new Error('Missing latestRelease.downloadLink');

      // Extract filename from URL
      const filename = safeSegment(app.name.toLowerCase());

      // Call Tauri command to download file natively
      const dirPath = await appDataDir();
      await invoke('download_app', { appDir: dirPath, url: downloadUrl, filename });

      // Minimal PATH behavior: if we just downloaded an .exe into appDataDir(),
      // ensure the app's data directory is on the user's PATH (Windows only).
      if (filename.toLowerCase().endsWith('.exe')) {
        await invoke('ensure_dir_on_user_path', { dir: dirPath });
      }

      // Save metadata (app.json)
      const downloaded = {
        appIcon: app.appIcon,
        name: app.name,
        author: app.author,
        type: app.type,
        repoUrl: app.repoUrl,
        dateAdded: new Date().toISOString(),
      };

      const appJsonPath = await join(dirPath, `${safeSegment(app.name)}_app.json`);
      const jsonBytes = new TextEncoder().encode(JSON.stringify(downloaded, null, 2));
      await writeFile(appJsonPath, jsonBytes);

      setDownloadedApps((prev) => [...prev, downloaded]);
    } catch (err) {
      console.error('Failed to install app:', err);
    } finally {
      setIsDownloading(false);
    }
  }, [app, appName, downloadedApps]);

  // Show placeholders while the app is loading
  if (!app) {
    return (
      <main className="my-2 mr-2 bg-background rounded-md flex-1">
        <ScrollArea className="h-full min-h-0 relative">
          <div className="flex flex-col gap-8 p-8">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-4">
                {/* App Name */}
                <Skeleton className="w-40 h-8 rounded-md" />
                {/* App Info */}
                <div className="flex flex-row gap-2">
                  {/* App Author */}
                  <Skeleton className="w-20 h-6 rounded-md" />
                  {/* App Category */}
                  <Skeleton className="w-15 h-6 border rounded-md" />
                </div>
              </div>

              {/* Download Button */}
              <Skeleton className="w-30 h-10 rounded-md bg-secondary" />
            </div>
            {/* App Description */}
            <Skeleton className="w-full h-24 rounded-md" />

            {/* App Screenshots */}
            <Carousel className="relative">
              <CarouselContent>
                <CarouselItem>
                  <Skeleton className="w-full rounded-md bg-secondary aspect-video" />
                </CarouselItem>
                <CarouselItem>
                  <Skeleton className="w-full rounded-md bg-secondary aspect-video" />
                </CarouselItem>
              </CarouselContent>
              <CarouselNext className="translate-y-0 absolute top-0 bottom-0 right-0 bg-transparent border-none dark:bg-transparent size-auto w-12 rounded-md " />
              <CarouselPrevious className="translate-y-0 absolute top-0 bottom-0 left-0 bg-transparent border-none dark:bg-transparent size-auto w-12 rounded-md " />
            </Carousel>
          </div>
        </ScrollArea>
      </main>
    );
  }

  return (
    <main className="my-2 mr-2 bg-background rounded-md flex-1">
      <ScrollArea className="h-full min-h-0 relative">
        <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 items-center">
                {/* App Name */}
                <h1 className="text-3xl font-bold">{app.name}</h1>
              </div>

              {/* App Info */}
              <div className="flex flex-row gap-4">
                {/* App Author */}
                <p className="text-md text-muted-foreground">by {app.author}</p>

                {/* App Tags */}
                <Badge key={app.category} variant="secondary">
                  {app.category}
                </Badge>
              </div>
            </div>

            {/* Download Button */}
            {!app.latestRelease ? (
              <Button disabled className="w-32" variant="secondary" size="lg">
                Unfinished
              </Button>
            ) : downloadedApps.find((app) => app.name === appName) ? (
              <Button disabled className="w-32" variant="secondary" size="lg">
                Installed
              </Button>
            ) : (
              <Button
                disabled={isDownloading}
                size="lg"
                className="w-32"
                onClick={installApp}
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get'}
              </Button>
            )}
          </div>

          {/* App Description */}
          <p className="text-sm text-muted-foreground">{app.description}</p>

          {/* App Screenshots */}
          <Carousel className="relative">
            <CarouselContent>
              {app.screenshots.map((screenshot) => (
                <CarouselItem key={screenshot}>
                  <img
                    src={screenshot}
                    alt={app.name}
                    className="w-full rounded-md bg-secondary aspect-video"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="translate-y-0 absolute top-0 bottom-0 right-0 bg-transparent border-none dark:bg-transparent size-auto w-12 rounded-md " />
            <CarouselPrevious className="translate-y-0 absolute top-0 bottom-0 left-0 bg-transparent border-none dark:bg-transparent size-auto w-12 rounded-md " />
          </Carousel>
        </div>
      </ScrollArea>
    </main>
  );
};

export default AppPage;
