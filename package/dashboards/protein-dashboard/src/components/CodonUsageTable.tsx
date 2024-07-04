import { fetchCodonUsage } from "api/api";
import { CodonUsage } from "api/apiDataTypes";
import { useEffect, useState } from "react";
import ReusableTable from "./reusableComponents/ReusableTable";

function CodonUsageTable() {
  const [codonUsage, setCodonUsage] = useState<CodonUsage[]>([]);

  useEffect(() => {
    const getProteins = async () => {
      const data = await fetchCodonUsage();
      setCodonUsage(data || []);
    };
    getProteins();
  }, []);

  return <ReusableTable caption="" data={codonUsage} />;
}

export default CodonUsageTable;
