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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LibraryApp } from '@/types';
import { EllipsisVerticalIcon, GithubIcon, PackageIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
  const [sortBy, setSortBy] = React.useState('name');
  const [search, setSearch] = React.useState('');
  const [items, _] = React.useState<LibraryApp[]>([]);

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
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 relative">
        <div className="mx-8 mb-8 flex flex-col gap-2">
          {items.length > 0 ? (
            items.map((item) => <LibraryApp key={item.name} {...item} />)
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <PackageIcon className="text-muted-foreground" size={64} />
              <h2 className="text-2xl font-bold text-muted-foreground">
                No apps in library
              </h2>
              <p className="text-muted-foreground">
                <Link to="/" className='underline cursor-pointer'>Add apps</Link> to your library to get started
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

const LibraryApp = (libraryApp: LibraryApp) => {
  return (
    <div className="flex items-center border rounded-md p-2">
      <div className="flex-2 flex items-center gap-2">
        <img
          src={libraryApp.image}
          alt={libraryApp.name}
          className="w-16 h-16 rounded-md bg-secondary"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{libraryApp.name}</h3>
          <p className="text-sm text-muted-foreground">{libraryApp.author}</p>
        </div>
      </div>
      <div className="flex-1">{libraryApp.type}</div>
      <div className="flex-1">{libraryApp.date}</div>
      <div className="flex-1 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link to={`/package/${libraryApp.id}`}>
                <PackageIcon /> App Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={libraryApp.repositoryUrl} target="_blank" rel="noreferrer">
                <GithubIcon /> Repository
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <TrashIcon /> Uninstall
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LibraryPage;
