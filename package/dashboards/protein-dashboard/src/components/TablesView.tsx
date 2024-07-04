import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProteinDataTable from "./tables/ProteinDataTable";
import ReusableTableView from "./tables/ReusableTableView";

function TablesView() {
  return (
    <Tabs defaultValue="proteinData" >
      <TabsList>
        <TabsTrigger value="proteinData">Protein Data</TabsTrigger>
        <TabsTrigger value="codonUsage">Codon Usage</TabsTrigger>
        <TabsTrigger value="geneAliases">Gene Aliases</TabsTrigger>
        <TabsTrigger value="geneAnnotations">Gene Annotations</TabsTrigger>
        <TabsTrigger value="gffAnnotations">GFF Annotations</TabsTrigger>
      </TabsList>
      <TabsContent value="proteinData" className="h-[70vh] overflow-auto">
        <ProteinDataTable />
      </TabsContent>
      <TabsContent value="codonUsage" className="h-[70vh] overflow-auto">
        <ReusableTableView dataSourceName="codon_usage" />
      </TabsContent>
      <TabsContent value="geneAliases" className="h-[70vh] overflow-auto">
        <ReusableTableView dataSourceName="gene_aliases" />
      </TabsContent>
      <TabsContent value="geneAnnotations" className="h-[70vh] overflow-auto">
        <ReusableTableView dataSourceName="gene_annotations" />
      </TabsContent>
      <TabsContent value="gffAnnotations" className="h-[70vh] overflow-auto">
        <ReusableTableView dataSourceName="gff_annotations" />
      </TabsContent>
    </Tabs>
  );
}

export default TablesView;
