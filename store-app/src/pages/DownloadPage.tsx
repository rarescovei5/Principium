import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const DownloadPage = () => {
  return (
    <main className="my-2 mr-2 px-8 pt-8 bg-background rounded-md flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Updates & Downloads</h1>
        <Button>Check for updates</Button>
      </div>
      <ScrollArea className="flex-1 min-h-0 relative"></ScrollArea>
    </main>
  );
};

export default DownloadPage;
