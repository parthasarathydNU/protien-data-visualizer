import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface PreviousConversationsSheetProps {
  prevConverationData: { title: string; id: string }[];
  loadPrevConv: (convId: string) => void;
}

const PreviousConversationsSheet: React.FC<PreviousConversationsSheetProps> = ({
  prevConverationData,
  loadPrevConv,
}) => {
  return (
    <Sheet>
      <SheetTrigger>
        {" "}
        <Button variant="link" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Conversations</SheetTitle>
          <SheetDescription>
            <ScrollArea className="">
              {prevConverationData.map(({id, title}) => (
                <>
                  <div
                    onClick={() => loadPrevConv(id)}
                    key={id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary hover:cursor-pointer hover:bg-muted"
                  >
                    {" "}
                    {title}{" "}
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
              {prevConverationData.length == 0 && 
              <div
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary hover:cursor-pointer hover:bg-muted"
            >
              {"History Not Available"}
            </div>
            }
            </ScrollArea>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default PreviousConversationsSheet;
