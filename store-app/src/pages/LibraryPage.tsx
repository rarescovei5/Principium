import { useApps } from '@/app/AppsProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { safeSegment } from '@/lib/safeSegment';
import type { DownloadedApp } from '@/types';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import {
  EllipsisVerticalIcon,
  GithubIcon,
  PackageIcon,
  TerminalIcon,
  TrashIcon,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
  const { downloadedApps } = useApps();
  const [sortBy, setSortBy] = React.useState('name');
  const [search, setSearch] = React.useState('');

  return (
    <main className="flex flex-col gap-4 my-2 mr-2 bg-background rounded-md flex-1">
      <div className="px-8 pt-8 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library</h1>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search"
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 relative">
        <div className="mx-8 mb-8 flex flex-col gap-2">
          {downloadedApps.length > 0 ? (
            downloadedApps.map((app) => <LibraryApp key={app.name} {...app} />)
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <PackageIcon className="text-muted-foreground" size={64} />
              <h2 className="text-2xl font-bold text-muted-foreground">
                No apps in library
              </h2>
              <p className="text-muted-foreground">
                <Link to="/" className="underline cursor-pointer">
                  Add apps
                </Link>{' '}
                to your library to get started
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

const LibraryApp = (app: DownloadedApp) => {
  const { setDownloadedApps } = useApps();
  const [isUninstalling, setIsUninstalling] = React.useState(false);

  const uninstallApp = async () => {
    setIsUninstalling(true);
    const appDir = await appDataDir();
    await invoke('uninstall_app', { appDir, appName: safeSegment(app.name) });
    setDownloadedApps((prev) => prev.filter((a) => a.name !== app.name));
    setIsUninstalling(false);
  };

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
      <div className="flex-1">{app.type}</div>
      <div className="flex-1">{app.dateAdded}</div>
      <div className="flex-1 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/apps/${app.name}`}>
                <PackageIcon /> App Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={app.repoUrl} target="_blank" rel="noreferrer">
                <GithubIcon /> Repository
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={uninstallApp}
              variant="destructive"
              disabled={isUninstalling}
            >
              <TrashIcon /> Uninstall
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LibraryPage;
