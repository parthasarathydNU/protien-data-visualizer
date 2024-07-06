import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ChartGeneratorChat from "./ChartGeneratorChat";
import { ChartsData } from "./types";

interface AddNewChartProps {
  saveChart : (chartData: ChartsData) => void
}

const AddNewChart : React.FC<AddNewChartProps> = ({saveChart}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>+ New Chart</Button>
      </DialogTrigger>
      <DialogContent className=" max-w-[50vw] min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Chart</DialogTitle>
          <DialogDescription>
            <ChartGeneratorChat saveChart={saveChart} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewChart;
