import VegaChart from "./VegaChart";
import DynamicResizableBox from "./DynamicResizableBox";
import "./styles/Visualize.css";
import { Fade } from "react-awesome-reveal";
import { useEffect, useState } from "react";
import AddNewChart from "./AddNewChart";
import { ChartsData } from "./types";
import { fetchCharts, saveChart } from "api/api";

import ChartControlSheet from "./ChartControlSheet";

function Visualize() {
  const [selectedChartIndex, setSelectedChartIndex] = useState<number>(-1);

  const [chartsData, setChartsData] = useState<ChartsData[]>([]);

  useEffect(() => {
    const fetchChartsData = async () => {
      const dbChartsData = await fetchCharts();
      const parsedChartsData = dbChartsData?.map((chartData) => {
        return {
          chart_data: JSON.parse(chartData.chart_data),
          chart_spec: JSON.parse(chartData.chart_spec),
        } as ChartsData;
      });

      if (parsedChartsData) {
        const updatedChartsData = [...chartsData, ...parsedChartsData];
        setChartsData(updatedChartsData);
      }
    };
    fetchChartsData();
  }, []);

  const updateChartSpec = (newSpec: any) => {
    if (selectedChartIndex < 0 || selectedChartIndex >= chartsData.length) {
      console.error("Invalid chart index");
      return;
    }

    const updatedChartData: ChartsData = {
      ...chartsData[selectedChartIndex], // Spread to create a shallow copy
      chart_spec: newSpec, // Directly update the chartSpec
    };

    const newChartsData = [...chartsData];
    newChartsData[selectedChartIndex] = updatedChartData;
    
    setChartsData(newChartsData);
  };

  const saveChartFn = (chartInfo: ChartsData) => {
    // Append this to the list of charts we have in this view
    const updatedCharts = [...chartsData, chartInfo];
    setChartsData(updatedCharts);
    console.log("saving chart");
    saveChart(chartInfo);
  };

  return (
    <div className="visualize-page">
      <Fade>
        <header>
          <h3>Visualize your data</h3>
          <div className="flex justify-between">
            <span>
              Space to play around with multiple charts and graphs to understand
              data better
            </span>
            {/* <button className="new-chart bg-blue-600">
              New Chart
            </button> */}
            {chartsData.length > 0 && <AddNewChart saveChart={saveChartFn} />}
          </div>
        </header>
      </Fade>
      <div
        style={{ height: "90%", overflowY: "scroll" }}
        className={`${chartsData.length == 0 ? "grid" : "block"}`}
      >
        {chartsData.length > 0 ? (
          <Fade delay={500} duration={300} className="h-full">
            <section className="grid-wrapper">
              <div className="charts-panel">
                {chartsData.map(({ chart_data, chart_spec }, index) => (
                  <DynamicResizableBox
                    key={index}
                    width={300}
                    minConstraints={[200, 150]}
                    maxConstraints={[800, 600]}
                  >
                    <div
                      className="chartDiv relative"
                      onClick={() => setSelectedChartIndex(index)}
                    >
                      <VegaChart data={chart_data} spec={chart_spec} />
                      <div title="Settings">

                      <ChartControlSheet 
                      chart_spec={chart_spec}
                      updateChartSpec={updateChartSpec}
                       />
                      </div>
                    </div>
                  </DynamicResizableBox>
                ))}
                {chartsData.length == 0 && (
                  <div className="flex justify-center align-middle">
                    <AddNewChart saveChart={saveChartFn} />
                  </div>
                )}
              </div>
              {/* {chartsData.length > 0 && (
                <div className="chartControls">
                  {chartsData[selectedChartIndex] ? (
                    <ChartControls
                      onSpecChange={(newSpec: any) => {
                        updateChartSpec(newSpec);
                      }}
                      spec={chartsData[selectedChartIndex].chart_spec}
                    />
                  ) : (
                    "Select a chart to see controls"
                  )}
                </div>
              )} */}
            </section>
          </Fade>
        ) : (
          <AddNewChart saveChart={saveChartFn} />
        )}
      </div>
    </div>
  );
}

export default Visualize;
