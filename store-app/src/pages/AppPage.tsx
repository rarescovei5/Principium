import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { App } from '@/types';
import React from 'react';
import { useParams } from 'react-router-dom';

const AppPage = () => {
  const { appId } = useParams();
  const [app, setApp] = React.useState<App | null>(null);

  React.useEffect(() => {
    let mockupApp: App = {
      name: 'Synclite',
      author: 'Principium',
      description:
        'Officia reprehenderit minim non dolore ipsum minim aute qui aute ipsum excepteur aliquip. Qui incididunt enim aliquip tempor id pariatur sit aliqua. Aute occaecat labore ullamco nulla reprehenderit eiusmod culpa qui veniam minim irure et consequat.',
      screenshots: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
      categories: ['Productivity'],
    };
    setApp(mockupApp);
  }, []);

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
                  {/* App Tags */}
                  <Skeleton className="w-15 h-6 border rounded-md" />
                  <Skeleton className="w-15 h-6 border rounded-md" />
                  <Skeleton className="w-15 h-6 border rounded-md" />
                </div>
              </div>

              {/* Download Button */}
              <Skeleton className="w-30 h-10 rounded-md bg-primary" />
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
        <div className="flex flex-col gap-8 p-8">
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
                <div className="flex flex-row gap-2">
                  {app.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <Button size="lg">Download</Button>
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
