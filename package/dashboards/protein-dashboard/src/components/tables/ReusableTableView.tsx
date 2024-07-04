import { fetchSamples } from 'api/api';
import ReusableTable from 'components/reusableComponents/ReusableTable';
import React, { useEffect, useState } from 'react'

interface ReusableTableViewProps {
    dataSourceName: string
}
const ReusableTableView: React.FC<ReusableTableViewProps> = ({dataSourceName}) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
      const getData = async () => {
        const data = await fetchSamples(dataSourceName);
        setData(data || []);
      };
      getData();
    }, []);
    
    return <ReusableTable caption="" data={data} />;
}

export default ReusableTableView
