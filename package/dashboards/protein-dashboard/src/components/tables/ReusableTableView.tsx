import { fetchSamples } from 'api/api';
import ReusableTable from 'components/reusableComponents/ReusableTable';
import React, { useEffect, useState } from 'react'
import ServiceDown from "./../ServiceDown"

interface ReusableTableViewProps {
    dataSourceName: string
}
const ReusableTableView: React.FC<ReusableTableViewProps> = ({dataSourceName}) => {
  
    const {data, isLoading, error} =  fetchSamples(dataSourceName);

    if (isLoading) {
      return <span>"Loading Data..."</span>
    }

    if(error || !data ){
      return <ServiceDown />
    }
    
    return <ReusableTable caption="" data={data} />;
}

export default ReusableTableView
