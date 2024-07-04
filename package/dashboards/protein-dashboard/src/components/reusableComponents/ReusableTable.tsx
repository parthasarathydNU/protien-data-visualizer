import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReusableTableProps {
  caption: string;
  data: any[];
}

const ReusableTable: React.FC<ReusableTableProps> = ({ caption, data }) => {
  if (!data || data.length == 0) {
    return <>"No Data to Render !"</>;
  }

  const columnNames = Object.keys(data[0]);
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        <TableRow>
          {columnNames.map((columnName) => (
            <TableHead className=" font-bold capitalize">{columnName}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow>
            {Object.values(row).map((value:any) => (
              <TableCell>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
