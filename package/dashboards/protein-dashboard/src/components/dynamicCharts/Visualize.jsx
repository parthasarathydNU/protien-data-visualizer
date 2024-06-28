import VegaChart from "./VegaChart";
import DynamicResizableBox from "./DynamicResizableBox";
import "./styles/Visualize.css";
import { Fade } from "react-awesome-reveal";
import ChartControls from "./ChartControls";
import { useState } from "react";
import AddNewChart from "./AddNewChart";

function Visualize() {
  /**
   * chartsData: [
   *  {
   *    chartData: JSON,
   *    chartSpec: JSON
   *  }
   * ]
   */
  const [chartsData, setChartsData] = useState([]);

  const [selectedChartIndex, setSelectedChartIndex] = useState(-1);

  const updateChartSpec = (newSpec) => {
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
            <AddNewChart />
          </div>
        </header>
      </Fade>
      <div style={{ height: "90%", overflowY: "scroll" }}>
        <Fade delay={500} duration={300}>
          <section className="grid-wrapper">
            <div className="charts-panel">
              {chartsData.map((index, { chartData, chartSpec }) => (
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
            </div>
            {chartsData.length > 0 && (
              <div className="chartControls">
                {chartsData[selectedChartIndex] ? (
                  <ChartControls
                    onSpecChange={(newSpec) => {
                      updateChartSpec(newSpec);
                    }}
                    spec={chartsData[selectedChartIndex]}
                  />
                ) : (
                  "Select a chart to see controls"
                )}
              </div>
            )}
          </section>
        </Fade>
      </div>
    </div>
  );
}

export default Visualize;
