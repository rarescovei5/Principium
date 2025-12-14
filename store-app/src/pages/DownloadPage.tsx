import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useApps } from '@/app/AppsProvider';
import { CloudDownloadIcon, Loader2Icon, TerminalIcon } from 'lucide-react';
import { App, DownloadedApp } from '@/types';
import { useInstallApp } from '@/hooks/useInstallApp';

const DownloadPage = () => {
  const { apps, downloadedApps } = useApps();

  const outdatedApps = React.useMemo(() => {
    return downloadedApps.filter((app) => {
      const newApp = apps?.find((a) => a.name === app.name);
      return (
        newApp &&
        newApp.latestRelease.tagName !== app.tagName
      );
    });
  }, [downloadedApps, apps]);

  console.log(outdatedApps);

  return (
    <main className="flex flex-col gap-8 my-2 mr-2 px-8 pt-8 bg-background rounded-md flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Updates & Downloads</h1>
      </div>
      <ScrollArea className="flex-1 min-h-0 relative">
        {outdatedApps.length > 0 ? (
          outdatedApps.map((app) => (
            <OutdatedApp
              key={app.name}
              app={app}
              newApp={apps?.find((a) => a.name === app.name)!}
            />
          ))
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <CloudDownloadIcon className="text-muted-foreground" size={64} />
            <h2 className="text-2xl font-bold text-muted-foreground">No outdated apps</h2>
            <p className="text-muted-foreground">All apps are up to date.</p>
          </div>
        )}
      </ScrollArea>
    </main>
  );
};

const OutdatedApp = ({ app, newApp }: { app: DownloadedApp; newApp: App }) => {
  const { isDownloading, installApp } = useInstallApp({ app: newApp, appName: app.name });

  return (
    <div className="flex items-center border rounded-md p-2">
      <div className="flex-2 flex items-center gap-2">
        {app.type.toLowerCase() === 'cli' ? (
          <div className="rounded-md bg-secondary w-16 h-16 flex items-center justify-center">
            <TerminalIcon size={32} />
          </div>
        ) : (
          <img
            src={app.appIcon}
            alt={app.name}
            className="object-cover rounded-md bg-secondary w-16 h-16"
          />
        )}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{app.name}</h3>
          <p className="text-sm text-muted-foreground">{app.author}</p>
        </div>
      </div>
      <div className="flex-1">
        Current: <br />
        {app.tagName}
      </div>
      <div className="flex-1">
        Newest: <br />
        {newApp.latestRelease.tagName}
      </div>
      <div className="flex-1 flex justify-end">
        <Button onClick={installApp} disabled={isDownloading}>
          {isDownloading ? <Loader2Icon className="animate-spin" /> : 'Update'}
        </Button>
      </div>
    </div>
  );
};

export default DownloadPage;
