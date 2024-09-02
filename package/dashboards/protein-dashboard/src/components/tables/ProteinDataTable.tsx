import { fetchProteins } from "api/api";
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
import ServiceDown from "../ServiceDown"

function ProteinDataTable() {
  
  const {data : proteins, isLoading, error} = fetchProteins();

  if (isLoading) {
    return <>"Loading data"</>;
  }

  if( error ) {
    return <ServiceDown />;
  }

  if(proteins?.length == 0 || !proteins) {
    return <>"No Data to Show"</>;
  }

  const columnNames = Object.keys(proteins[0]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columnNames.map((columnName, index) => (
            <TableHead key={index} className=" font-bold capitalize">
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
