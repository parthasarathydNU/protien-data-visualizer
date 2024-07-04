import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProteinsList from "./ProteinsList";
import ReusableTableView from "./tables/ReusableTableView";

function TablesView() {
  return (
    <Tabs defaultValue="proteinData" className="">
      <TabsList>
        <TabsTrigger value="proteinData">Protein Data</TabsTrigger>
        <TabsTrigger value="codonUsage">Codon Usage</TabsTrigger>
        <TabsTrigger value="geneAliases">Gene Aliases</TabsTrigger>
        <TabsTrigger value="geneAnnotations">Gene Annotations</TabsTrigger>
        <TabsTrigger value="gffAnnotations">GFF Annotations</TabsTrigger>
      </TabsList>
      <TabsContent value="proteinData">
        <ProteinsList />
      </TabsContent>
      <TabsContent value="codonUsage">
        <ReusableTableView dataSourceName="codon_usage" />
      </TabsContent>
      <TabsContent value="geneAliases">
        <ReusableTableView dataSourceName="gene_aliases" />
      </TabsContent>
      <TabsContent value="geneAnnotations">
        <ReusableTableView dataSourceName="gene_annotations" />
      </TabsContent>
      <TabsContent value="gffAnnotations">
        <ReusableTableView dataSourceName="gff_annotations" />
      </TabsContent>
    </Tabs>
  );
}

export default TablesView;
