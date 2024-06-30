import VegaChart from "./VegaChart";
import DynamicResizableBox from "./DynamicResizableBox";
import "./styles/Visualize.css";
import { Fade } from "react-awesome-reveal";
import ChartControls from "./ChartControls";
import { useState } from "react";
import AddNewChart from "./AddNewChart";
import { ChartsData } from "./types";

function Visualize() {
  const [chartsData, setChartsData] = useState<ChartsData[]>([]);

  const [selectedChartIndex, setSelectedChartIndex] = useState<number>(-1);

  const updateChartSpec = (newSpec: any) => {
    if (selectedChartIndex < 0 || selectedChartIndex >= chartsData.length) {
      console.error("Invalid chart index");
      return;
    }

    const updatedChartData = {
      ...chartsData[selectedChartIndex], // Spread to create a shallow copy
      chartSpec: newSpec, // Directly update the chartSpec
    };

    const newChartsData = [...chartsData];
    newChartsData[selectedChartIndex] = updatedChartData;

    setChartsData(newChartsData);
  };

  const saveChart = (chartInfo: ChartsData): void => {
    // Append this to the list of charts we have in this view
    const updatedCharts = [...chartsData, chartInfo];
    setChartsData(updatedCharts);
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
            {chartsData.length > 0 && <AddNewChart saveChart={saveChart} />}
          </div>
        </header>
      </Fade>
      <div style={{ height: "90%", overflowY: "scroll" }} className={`${chartsData.length == 0 ? "grid" : "block"}`}>
        {chartsData.length > 0 ? (
                  <Fade delay={500} duration={300} className="h-full">
                  <section className="grid-wrapper">
                    <div className="charts-panel">
                      {chartsData.map(({ chartData, chartSpec }, index) => (
                        <DynamicResizableBox
                          key={index}
                          width={300}
                          minConstraints={[200, 150]}
                          maxConstraints={[800, 600]}
                        >
                          <div
                            className="chartDiv"
                            onClick={() => setSelectedChartIndex(index)}
                          >
                            <VegaChart data={chartData} spec={chartSpec} />
                          </div>
                        </DynamicResizableBox>
                      ))}
                      {chartsData.length == 0 && (
                        <div className="flex justify-center align-middle">
                          <AddNewChart saveChart={saveChart} />
                        </div>
                      )}
                    </div>
                    {chartsData.length > 0 && (
                      <div className="chartControls">
                        {chartsData[selectedChartIndex] ? (
                          <ChartControls
                            onSpecChange={(newSpec: any) => {
                              updateChartSpec(newSpec);
                            }}
                            spec={chartsData[selectedChartIndex].chartSpec}
                          />
                        ) : (
                          "Select a chart to see controls"
                        )}
                      </div>
                    )}
                  </section>
                </Fade>
        ) : (
          <AddNewChart saveChart={saveChart} />
        )
        
      }

      </div>
    </div>
  );
}

export default Visualize;
