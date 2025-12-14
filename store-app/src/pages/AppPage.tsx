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
import { useInstallApp } from '@/hooks/useInstallApp';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

const AppPage = () => {
  // Get the app name from the URL
  const { appName } = useParams();

  // Get the entry of the app from the apps list
  const { apps, downloadedApps  } = useApps();
  const app = apps.find((app) => app.name === appName);

  // Initialize the install app hook
  const { isDownloading, installApp } = useInstallApp({ app, appName });

  // Show placeholders while the app data is loading
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
