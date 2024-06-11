const chart1Data = [
  {
    Flask: "1",
    "Cell type": "HEK293T",
    "Target seeding density": "2.00E+06",
    "DNA concentration ug/ml": "5",
    Media: "F-17",
    "Flask Size": "125ml",
    "Culutre Volume": "30",
    "N-1 Cell density/ml": "5.00E+06",
    "N-1 Culutre volume required (ml)": "6.000",
    "Media required N-1": "24.000",
  },
  {
    Flask: "2",
    "Cell type": "HEK293T",
    "Target seeding density": "2.00E+06",
    "DNA concentration ug/ml": "5",
    Media: "F-17",
    "Flask Size": "125ml",
    "Culutre Volume": "30",
    "N-1 Cell density/ml": "5.00E+06",
    "N-1 Culutre volume required (ml)": "6.000",
    "Media required N-1": "24.000",
  },
  {
    Flask: "3",
    "Cell type": "HEK293T",
    "Target seeding density": "2.00E+06",
    "DNA concentration ug/ml": "5",
    Media: "F-17",
    "Flask Size": "125ml",
    "Culutre Volume": "30",
    "N-1 Cell density/ml": "5.00E+06",
    "N-1 Culutre volume required (ml)": "6.000",
    "Media required N-1": "24.000",
  },
  {
    Flask: "4",
    "Cell type": "HEK293T",
    "Target seeding density": "5.00E+06",
    "DNA concentration ug/ml": "8",
    Media: "BalanCD",
    "Flask Size": "125ml",
    "Culutre Volume": "40",
    "N-1 Cell density/ml": "5.00E+06",
    "N-1 Culutre volume required (ml)": "15.000",
    "Media required N-1": "35.000",
  },
  {
    Flask: "5",
    "Cell type": "HEK293T",
    "Target seeding density": "5.00E+06",
    "DNA concentration ug/ml": "8",
    Media: "BalanCD",
    "Flask Size": "125ml",
    "Culutre Volume": "40",
    "N-1 Cell density/ml": "5.00E+06",
    "N-1 Culutre volume required (ml)": "15.000",
    "Media required N-1": "35.000",
  },
  {
    Flask: "6",
    "Cell type": "HEK293T",
    "Target seeding density": "5.00E+06",
    "DNA concentration ug/ml": "8",
    Media: "BalanCD",
    "Flask Size": "125ml",
    "Culutre Volume": "40",
    "N-1 Cell density/ml": "5.00E+06",
    "N-1 Culutre volume required (ml)": "15.000",
    "Media required N-1": "35.000",
  },
];

const chart1VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Target seeding density by Flask",
  data: {
    name: "data", // This allows you to dynamically pass the data
  },
  mark: "bar",
  encoding: {
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "Target seeding density",
      type: "quantitative",
      axis: { title: "Target seeding density" },
    },
    tooltip: [
      { field: "Cell type", type: "nominal" },
      { field: "DNA concentration ug/ml", type: "quantitative" },
      { field: "Media", type: "nominal" },
      { field: "Flask Size", type: "nominal" },
      { field: "Culutre Volume", type: "quantitative" },
      { field: "N-1 Cell density/ml", type: "quantitative" },
      { field: "N-1 Culutre volume required (ml)", type: "quantitative" },
      { field: "Media required N-1", type: "quantitative" },
    ],
  },
  interaction: {
    hover: true,
    select: true,
  },
};

const chart2VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "DNA concentration by Flask",
  data: {
    name: "data",
  },
  mark: "line",
  encoding: {
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "DNA concentration ug/ml",
      type: "quantitative",
      axis: { title: "DNA concentration (ug/ml)" },
    },
  },
};

const chart3VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title:
    "Target seeding density vs N-1 Cell density",
  data: {
    name: "data",
  },
  mark: "point",
  encoding: {
    x: {
      field: "Target seeding density",
      type: "quantitative",
      axis: { title: "Target seeding density" },
    },
    y: {
      field: "N-1 Cell density/ml",
      type: "quantitative",
      axis: { title: "N-1 Cell density/ml" },
    },
    tooltip: [
      { field: "Flask", type: "nominal" },
      { field: "Cell type", type: "nominal" },
      { field: "Media", type: "nominal" },
    ],
  },
};

const chart4VegaSpec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  title: "Proportions of DNA concentration",
  data: {
    name: "data",
  },
  transform: [
    {
      type: "aggregate",
      groupby: ["Flask"],
      summarize: [
        { field: "DNA concentration ug/ml", op: "sum", as: "sum_DNA" },
      ],
    },
    {
      type: "pie",
      field: "sum_DNA",
      as: ["startAngle", "endAngle"],
    },
  ],
  marks: [
    {
      type: "arc",
      from: { data: "data" },
      encode: {
        enter: {
          x: { signal: "width / 2" },
          y: { signal: "height / 2" },
          startAngle: { field: "startAngle" },
          endAngle: { field: "endAngle" },
          padAngle: { signal: 0.01 },
          innerRadius: { signal: 0 },
          outerRadius: { signal: "width / 2" },
          stroke: { value: "white" },
          fill: { field: "Flask", type: "ordinal" },
        },
      },
    },
  ],
};

const chart5VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "DNA concentration by Flask",
  data: {
    name: "data",
  },
  mark: "area",
  encoding: {
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "DNA concentration ug/ml",
      type: "quantitative",
      axis: { title: "DNA concentration (ug/ml)" },
    },
  },
};

const chart6VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Target seeding density by Media",
  data: {
    name: "data",
  },
  mark: "bar",
  encoding: {
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "Target seeding density",
      type: "quantitative",
      axis: { title: "Target seeding density" },
    },
    color: {
      field: "Media",
      type: "nominal",
      legend: { title: "Media" },
    },
  },
};

const chart7VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title:
    "Target seeding density by Flask and Media",
  data: {
    name: "data",
  },
  mark: "bar",
  encoding: {
    column: {
      field: "Media",
      type: "nominal",
      spacing: 10,
      header: { title: "Media" },
    },
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "Target seeding density",
      type: "quantitative",
      axis: { title: "Target seeding density" },
    },
  },
};

const chart8VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title:
    "Target seeding density vs N-1 Cell density",
  data: {
    name: "data",
  },
  mark: "point",
  encoding: {
    x: {
      field: "Target seeding density",
      type: "quantitative",
      axis: { title: "Target seeding density" },
    },
    y: {
      field: "N-1 Cell density/ml",
      type: "quantitative",
      axis: { title: "N-1 Cell density/ml" },
    },
    size: {
      field: "DNA concentration ug/ml",
      type: "quantitative",
      legend: { title: "DNA concentration (ug/ml)" },
    },
    color: {
      field: "Media",
      type: "nominal",
      legend: { title: "Media" },
    },
    tooltip: [
      { field: "Flask", type: "nominal" },
      { field: "Cell type", type: "nominal" },
      { field: "Media", type: "nominal" },
    ],
  },
};

const chart9VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Distribution of DNA concentration",
  data: {
    name: "data",
  },
  mark: "bar",
  encoding: {
    x: {
      field: "DNA concentration ug/ml",
      bin: true,
      axis: { title: "DNA concentration (ug/ml)" },
    },
    y: {
      aggregate: "count",
      type: "quantitative",
      axis: { title: "Count" },
    },
  },
};

const chart10VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "DNA concentration by Flask and Media",
  data: {
    name: "data",
  },
  mark: "rect",
  encoding: {
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "Media",
      type: "nominal",
      axis: { title: "Media" },
    },
    color: {
      field: "DNA concentration ug/ml",
      type: "quantitative",
      legend: { title: "DNA concentration (ug/ml)" },
    },
    tooltip: [
      { field: "Flask", type: "nominal" },
      { field: "Media", type: "nominal" },
      { field: "DNA concentration ug/ml", type: "quantitative" },
    ],
  },
};

const chart11VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title:
    "Distribution of DNA concentration by Flask",
  data: {
    name: "data",
  },
  mark: "boxplot",
  encoding: {
    x: {
      field: "Flask",
      type: "ordinal",
      axis: { title: "Flask" },
    },
    y: {
      field: "DNA concentration ug/ml",
      type: "quantitative",
      axis: { title: "DNA concentration (ug/ml)" },
    },
    tooltip: [
      { field: "Flask", type: "nominal" },
      { field: "Cell type", type: "nominal" },
      { field: "Media", type: "nominal" },
    ],
  },
};

const chart12VegaSpec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  title:
    "Distribution of DNA concentration by Flask",
  data: {
    name: "data",
  },
  transform: [
    {
      type: "kde",
      field: "DNA concentration ug/ml",
      groupby: ["Flask"],
      bandwidth: 0.3,
      extent: [0, 10],
    },
  ],
  layer: [
    {
      mark: "area",
      encoding: {
        x: {
          field: "value",
          type: "quantitative",
          axis: { title: "DNA concentration (ug/ml)" },
        },
        y: {
          field: "density",
          type: "quantitative",
          axis: { title: "Density" },
        },
        color: {
          field: "Flask",
          type: "nominal",
        },
      },
    },
  ],
};

const chart13VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Various metrics by Flask",
  data: {
    name: "data",
  },
  transform: [
    { calculate: "datum['Target seeding density']", as: "Metric" },
    { calculate: "datum['N-1 Cell density/ml']", as: "Metric2" },
    { calculate: "datum['DNA concentration ug/ml']", as: "Metric3" },
  ],
  mark: "line",
  encoding: {
    theta: { field: "Metric", type: "quantitative" },
    radius: { field: "Metric2", type: "quantitative" },
    color: { field: "Flask", type: "nominal" },
  },
};

const chart14VegaSpec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  title: "DNA concentration by Flask and Media",
  data: {
    name: "data",
  },
  transform: [
    {
      type: "nest",
      keys: ["Flask", "Media"],
    },
    {
      type: "treemap",
      field: "DNA concentration ug/ml",
      sort: { field: "value", order: "descending" },
      size: [{ signal: "width" }, { signal: "height" }],
      padding: 1,
      round: true,
    },
  ],
  marks: [
    {
      type: "rect",
      from: { data: "data" },
      encode: {
        enter: {
          x: { field: "x0" },
          y: { field: "y0" },
          x2: { field: "x1" },
          y2: { field: "y1" },
          stroke: { value: "white" },
          fill: { field: "Flask" },
        },
        update: {
          fillOpacity: { value: 1 },
        },
        hover: {
          fillOpacity: { value: 0.5 },
        },
      },
    },
  ],
};

const chart15VegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Parallel coordinates plot for different metrics by Flask",
  data: {
    name: "data",
  },
  transform: [
    {
      fold: [
        "Target seeding density",
        "DNA concentration ug/ml",
        "N-1 Cell density/ml",
      ],
    },
  ],
  mark: "line",
  encoding: {
    x: { field: "key", type: "nominal" },
    y: { field: "value", type: "quantitative" },
    color: { field: "Flask", type: "nominal" },
  },
};

export {
  chart1Data,
  chart1VegaSpec,
  chart2VegaSpec,
  chart3VegaSpec,
  chart4VegaSpec,
  chart5VegaSpec,
  chart6VegaSpec,
  chart7VegaSpec,
  chart8VegaSpec,
  chart9VegaSpec,
  chart10VegaSpec,
  chart11VegaSpec,
  chart12VegaSpec,
  chart13VegaSpec,
  chart14VegaSpec,
  chart15VegaSpec
};
