import { useApps } from '@/app/AppsProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useUninstallApp } from '@/hooks/useUninstallApp';
import { formatDate } from '@/lib/formatDate';
import type { DownloadedApp } from '@/types';
import {
  EllipsisVerticalIcon,
  GithubIcon,
  PackageIcon,
  TerminalIcon,
  TrashIcon,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFuzzyRegex(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const pattern = Array.from(trimmed)
    .map((ch) => (/\s/.test(ch) ? '.*' : escapeRegExp(ch)))
    .join('.*');

  try {
    return new RegExp(pattern, 'i');
  } catch {
    return null;
  }
}

const LibraryPage = () => {
  const { downloadedApps } = useApps();
  const [sortBy, setSortBy] = React.useState('name');
  const [search, setSearch] = React.useState('');

  const visibleApps = React.useMemo(() => {
    const query = search.trim();
    const fuzzy = buildFuzzyRegex(search);

    const filtered = query
      ? downloadedApps.filter((app) => {
          return fuzzy?.test(app.name.toLowerCase());
        })
      : downloadedApps;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        // Newest first
        const at = Date.parse(a.dateAdded ?? '') || 0;
        const bt = Date.parse(b.dateAdded ?? '') || 0;
        return bt - at;
      }

      const an = (a.name ?? '').toLowerCase();
      const bn = (b.name ?? '').toLowerCase();
      return an.localeCompare(bn);
    });

    return sorted;
  }, [downloadedApps, search, sortBy]);

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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 relative">
        <div className="mx-8 mb-8 flex flex-col gap-2">
          {visibleApps.length > 0 ? (
            visibleApps.map((app) => <LibraryApp key={app.name} {...app} />)
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <PackageIcon className="text-muted-foreground" size={64} />
              <h2 className="text-2xl font-bold text-muted-foreground">
                {downloadedApps.length > 0 ? 'No results' : 'No apps in library'}
              </h2>
              {downloadedApps.length > 0 ? (
                <p className="text-muted-foreground">Try a different search term.</p>
              ) : (
                <p className="text-muted-foreground">
                  <Link to="/" className="underline cursor-pointer">
                    Add apps
                  </Link>{' '}
                  to your library to get started
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

const LibraryApp = (downloadedApp: DownloadedApp) => {
  const { isUninstalling, uninstallApp } = useUninstallApp({ downloadedApp });

  return (
    <div className="flex items-center border rounded-md p-2">
      <div className="flex-2 flex items-center gap-2">
        {downloadedApp.type.toLowerCase() === 'cli' ? (
          <div className="rounded-md bg-secondary w-16 h-16 flex items-center justify-center">
            <TerminalIcon size={32} />
          </div>
        ) : (
          <img
            src={downloadedApp.appIcon}
            alt={downloadedApp.name}
            className="object-cover rounded-md bg-secondary w-16 h-16"
          />
        )}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{downloadedApp.name}</h3>
          <p className="text-sm text-muted-foreground">{downloadedApp.author}</p>
        </div>
      </div>
      <div className="flex-1">{downloadedApp.type}</div>
      <div className="flex-1">{formatDate(downloadedApp.dateAdded)}</div>
      <div className="flex-1 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{downloadedApp.tagName}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/apps/${downloadedApp.name}`}>
                  <PackageIcon /> App Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={downloadedApp.repoUrl} target="_blank" rel="noreferrer">
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LibraryPage;
