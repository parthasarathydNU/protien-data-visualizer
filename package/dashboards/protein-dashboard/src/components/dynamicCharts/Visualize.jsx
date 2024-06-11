import VegaChart from "./VegaChart";
import DynamicResizableBox from "./DynamicResizableBox";
import "./styles/Visualize.css";
import {
  chart10VegaSpec,
  chart1Data,
  chart1VegaSpec,
  chart2VegaSpec,
  chart3VegaSpec,
  chart5VegaSpec,
  chart6VegaSpec,
  chart8VegaSpec,
  chart9VegaSpec,
} from "./data/data";
import { Fade } from "react-awesome-reveal";
import ChartControls from "./ChartControls";
import { useState } from "react";

function Visualize() {
  const [specChart1, setSpecChart1] = useState(chart1VegaSpec);
  const [specChart2, setSpecChart2] = useState(chart2VegaSpec);
  const [selectedSpec, setSelectedSpec] = useState(chart1VegaSpec);
  return (
    <div className="visualize-page">
      <Fade>
        <header>
          <h3>Visualize your data</h3>
          <div>
            Space to play around with multiple charts and graphs to understand
            data better
          </div>
        </header>
      </Fade>
      <div style={{height: "90%", overflowY: "scroll"}}>
        <Fade delay={500} duration={300}>
          <section className="grid-wrapper">
            <div className="charts-panel">
              {/* Adding 4 charts in here as hard coded */}
              <DynamicResizableBox
                width={300}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div
                  className="chartDiv"
                  onClick={() => setSelectedSpec(specChart1)}
                >
                  <VegaChart data={chart1Data} spec={specChart1} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={450}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div
                  className="chartDiv"
                  onClick={() => setSelectedSpec(specChart2)}
                >
                  <VegaChart data={chart1Data} spec={specChart2} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={450}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div className="chartDiv">
                  <VegaChart data={chart1Data} spec={chart3VegaSpec} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={300}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div className="chartDiv">
                  <VegaChart data={chart1Data} spec={chart5VegaSpec} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={800}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div className="chartDiv">
                  <VegaChart data={chart1Data} spec={chart6VegaSpec} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={800}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div className="chartDiv">
                  <VegaChart data={chart1Data} spec={chart8VegaSpec} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={300}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div className="chartDiv">
                  <VegaChart data={chart1Data} spec={chart9VegaSpec} />
                </div>
              </DynamicResizableBox>
              <DynamicResizableBox
                width={450}
                minConstraints={[200, 150]}
                maxConstraints={[800, 600]}
              >
                <div className="chartDiv">
                  <VegaChart data={chart1Data} spec={chart10VegaSpec} />
                </div>
              </DynamicResizableBox>
            </div>
            <div className="chartControls">
              {selectedSpec ? (
                <ChartControls
                  onSpecChange={(newSpec) => {
                    setSpecChart1(newSpec);
                    setSelectedSpec(newSpec);
                  }}
                  spec={selectedSpec}
                />
              ) : (
                "Select a chart to see controls"
              )}
            </div>
          </section>
        </Fade>
      </div>
    </div>
  );
}

export default Visualize;
