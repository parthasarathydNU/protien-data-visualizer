import { fetchSamples } from 'api/api';
import ReusableTable from 'components/reusableComponents/ReusableTable';
import React, { useEffect, useState } from 'react'

interface ReusableTableViewProps {
    dataSourceName: string
}
const ReusableTableView: React.FC<ReusableTableViewProps> = ({dataSourceName}) => {
  
    const {data, isLoading, error} =  fetchSamples(dataSourceName);

    if(!data){
      return <>"No Data to display"</>
    }
    
    return <ReusableTable caption="" data={data} />;
}

export default ReusableTableView
