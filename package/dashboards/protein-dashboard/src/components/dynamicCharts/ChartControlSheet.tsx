import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
  import { IoIosSettings } from "react-icons/io";
import { Button } from "@/components/ui/button";
import ChartControls from "./ChartControls";

interface ChartControlSheetProps {
    selectedChartIndex: number
    chart_spec: JSON
    updateChartSpec: (spec:JSON) => void
}

const ChartControlSheet: React.FC<ChartControlSheetProps> = ({selectedChartIndex, chart_spec, updateChartSpec}) => {
  return (
    <Sheet>
      <SheetTrigger>
        {" "}
        <Button variant={"link"} size="icon" className="absolute top-0 right-0">
          <IoIosSettings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Change Chart Setting - Chart {selectedChartIndex + 1}
          </SheetTitle>
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
