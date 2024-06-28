import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import ChartGeneratorChat from "./ChartGeneratorChat";

function AddNewChart() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button>New Chart</Button>
      </SheetTrigger>
      <SheetContent >
        <SheetHeader>
          <SheetTitle>Create Chart</SheetTitle>
          <SheetDescription>
            
              <ChartGeneratorChat />

          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default AddNewChart;
