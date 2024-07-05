import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";


import { IoIosSettings } from "react-icons/io";
import { Button } from "@/components/ui/button";
import ChartControls from "./ChartControls";

interface ChartControlSheetProps {
  chart_spec: JSON;
  updateChartSpec: (spec: JSON) => void;
}

const ChartControlSheet: React.FC<ChartControlSheetProps> = ({
  chart_spec,
  updateChartSpec,
}) => {
  return (
    <Sheet>
      <SheetTrigger>
        {" "}
        <Button
          variant={"link"}
          size="icon"
          className="absolute bottom-0 left-0"
        >
          <IoIosSettings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetDescription>
            <ChartControls
              onSpecChange={(newSpec: any) => {
                updateChartSpec(newSpec);
              }}
              spec={chart_spec}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ChartControlSheet;
