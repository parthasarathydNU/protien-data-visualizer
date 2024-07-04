import { fetchProteins } from "api/api";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProteinData } from "api/apiDataTypes";
import { Link } from "react-router-dom";

function ProteinDataTable() {
  const [proteins, setProteins] = useState<any[] | undefined>([]);

  useEffect(() => {
    const getProteins = async () => {
      let data = await fetchProteins();
      setProteins(data);
    };
    getProteins();
  }, []);

  if (!proteins || proteins.length == 0) {
    return <>"No Data to Render !"</>;
  }

  const columnNames = Object.keys(proteins[0]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columnNames.map((columnName) => (
            <TableHead className=" font-bold capitalize">
              {columnName}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {proteins.map((row: ProteinData) => (
          <TableRow>
            {Object.entries(row).map(([key, value]) =>
              key === "entry" ? (
                <TableCell>
                  <Link to={`/proteins/${value}`} className="underline">
                    {JSON.stringify(value)}
                  </Link>
                </TableCell>
              ) : (
                <TableCell>{JSON.stringify(value)}</TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProteinDataTable;
