import React from "react";
import { Vega } from "react-vega";

const VegaChart = ({ data, spec }) => {
  // Combine data and spec
  const finalSpec = {
    ...spec,
    autosize: {
      type: "fit-y",
      resize: true
    },
    data: {
      values: data,
    },
  };

  return <Vega spec={finalSpec} />;
};

export default VegaChart;
