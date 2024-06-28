import { MessageContentTypeEnum } from "api";
import ReusableChatBot from "components/ReusableChatbot";
import React, { useEffect, useState } from "react";

const chartAPI = {
  getDataSources: async () => {
    // Simulated fetching of data sources
    return ["DataSource1", "DataSource2", "DataSource3"];
  },
  createChartFromQuery: async (dataSource: any, query: string) => {
    // Simulated chart creation logic
    return {
      type: MessageContentTypeEnum.chart,
      spec: {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A simple bar chart with embedded data.",
        mark: "bar",
        encoding: {
          x: { field: "a", type: "nominal", axis: { labelAngle: 0 } },
          y: { field: "b", type: "quantitative" },
        },
      },
    };
  },
};

function ChartGeneratorChat() {
  const [dataSources, setDataSources] = useState<string[]>([]);

  useEffect(() => {
    const fetchDataSources = async () => {
      const sources = await chartAPI.getDataSources();
      setDataSources(sources);
    };
    fetchDataSources();
  }, []);

  const getAIResponse = async (payload: { query: string }) => {
    const dataSource = dataSources[0]; // Simplified for example
    const chartSpec = await chartAPI.createChartFromQuery(
      dataSource,
      payload.query
    );
    return {
      response: chartSpec.spec,
      type: chartSpec.type,
    };
  };

  return (
    <div>
      <ReusableChatBot
        initialMessage="Welcome to the Chart Generator! Ask me to create a chart."
        followUpQuestionsInitial={[
          "What charts can I create with this data source",
        ]}
        getAIResponse={getAIResponse}
        getFollowUpQuestions={() =>
          Promise.resolve({ follow_up_questions: [] })
        }
        chartData={{
          values: [
            { a: "A", b: 20 },
            { a: "B", b: 34 },
            { a: "C", b: 55 },
          ],
        }}
      />
    </div>
  );
}

export default ChartGeneratorChat;
