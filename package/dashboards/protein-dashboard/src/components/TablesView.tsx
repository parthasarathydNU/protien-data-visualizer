import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodonUsageTable from "./CodonUsageTable";
import ProteinsList from "./ProteinsList";

function TablesView() {
  return (
    <Tabs defaultValue="proteinData" className="">
      <TabsList>
        <TabsTrigger value="proteinData">Protein Data</TabsTrigger>
        <TabsTrigger value="codonUsage">Codon Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="proteinData">
        <ProteinsList />
      </TabsContent>
      <TabsContent value="codonUsage">
        <CodonUsageTable />
      </TabsContent>
    </Tabs>
  );
}

export default TablesView;
