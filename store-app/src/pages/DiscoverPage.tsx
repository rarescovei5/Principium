import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { PackageIcon } from 'lucide-react';
import { DiscoverApp } from '@/types';
import { useApps } from '@/app/AppsProvider';

const DiscoverPage = () => {
  const { apps } = useApps();
  const categories = React.useMemo(
    () => apps ? [...new Set(apps.map((app) => app.category))] : [],
    [apps]
  );

  if (!apps) {
    return (
      <main className="my-2 px-8 pt-8 mr-2 bg-background rounded-md flex-1">
        <ScrollArea className="flex-1 min-h-0 relative"></ScrollArea>
      </main>
    );
  }

  return (
    <main className="my-2 px-8 pt-8 mr-2 bg-background rounded-md flex-1">
      <ScrollArea className="flex-1 min-h-0 relative">
        {categories.map((category) => (
          <Category
            key={category}
            name={category}
            apps={apps.filter((app) => app.category === category)}
          />
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
          <App key={app.name} {...app} />
        ))}
      </div>
    </section>
  );
};

const App = ({ appIcon, name }: DiscoverApp) => {
  const [imgFailedToLoad, setImgFailedToLoad] = React.useState(false);
  return (
    <Link to={`/apps/${name}`} className="flex flex-col gap-2">
      {imgFailedToLoad ? (
        <div className="rounded-md bg-secondary w-32 h-32 flex items-center justify-center">
          <PackageIcon size={64} />
        </div>
      ) : (
        <img
          src={appIcon}
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
