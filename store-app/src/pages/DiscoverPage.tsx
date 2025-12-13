import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { PackageIcon } from 'lucide-react';
import { DiscoverApp } from '@/types';

const DiscoverPage = () => {
  const [apps, setApps] = React.useState<DiscoverApp[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    let mockupApps: DiscoverApp[] = [
      {
        image: 'https://via.placeholder.com/150',
        name: 'Synclite',
        id: '1',
        category: 'Productivity',
      },
      {
        image: 'https://via.placeholder.com/150',
        name: 'Baum',
        id: '2',
        category: 'Productivity',
      },
      {
        image: 'https://via.placeholder.com/150',
        name: 'TaskTrack',
        id: '3',
        category: 'Productivity',
      },
    ];
    setApps(mockupApps);
    setCategories([...new Set(mockupApps.map((app) => app.category))]);
  }, []);

  return (
    <main className="my-2 px-8 pt-8 mr-2 bg-background rounded-md flex-1">
      <ScrollArea className="flex-1 min-h-0 relative">
        {categories.map((category) => (
          <Category key={category} name={category} apps={apps.filter((app) => app.category === category)} />
        ))}
      </ScrollArea>
    </main>
  );
};

const Category = ({ name, apps }: { name: string; apps: Array<DiscoverApp> }) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{name}</h2>
      <div
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
          gridAutoRows: 'max-content',
        }}
        className="grid gap-2"
      >
        {apps.map((app) => (
          <App key={app.id} {...app} />
        ))}
      </div>
    </section>
  );
};

const App = ({ image, name, id }: DiscoverApp) => {
  const [imgFailedToLoad, setImgFailedToLoad] = React.useState(false);
  return (
    <Link to={`/app/$${id}`} className="flex flex-col gap-2">
      {imgFailedToLoad ? (
        <div className="rounded-md bg-secondary w-32 h-32 flex items-center justify-center">
          <PackageIcon size={64} />
        </div>
      ) : (
        <img
          src={image}
          alt={name}
          className="object-cover rounded-md bg-secondary w-32 h-32"
          onError={() => {
            setImgFailedToLoad(true);
          }}
        />
      )}
      <h3>{name}</h3>
    </Link>
  );
};

export default DiscoverPage;
