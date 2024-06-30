import {
  AIChartQueryRequest,
  AIChatBotRequestTypes,
  getAIChartResponse,
} from "api";
import ReusableChatBot from "components/ReusableChatbot";
import { ChartsData } from "./types";

interface ChartGeneratorProps {
  saveChart: (chartsData: ChartsData) => void
}

const ChartGeneratorChat : React.FC<ChartGeneratorProps> = ({saveChart}) =>  {
  const getAIChartRes = async (payload: AIChatBotRequestTypes) => {
    const AiChartPayload: AIChartQueryRequest = {
      ...payload,
      table_name: "codon_usage",
    };

    return await getAIChartResponse(AiChartPayload);
  };

  return (
    <div>
      <ReusableChatBot
        initialMessage="Welcome to the Chart Generator! Ask me to create a chart."
        followUpQuestionsInitial={[]}
        getAIResponse={getAIChartRes}
        getFollowUpQuestions={() =>
          Promise.resolve({ follow_up_questions: [] })
        }
        saveChart={saveChart}
        chartData={ [
            {
              codon: "UAA",
              aa: "*",
              freq: 0.91,
              abundance: 0.69,
            },
            {
              codon: "AUG",
              aa: "M",
              freq: 1,
              abundance: 0.8,
            },
            {
              codon: "UUU",
              aa: "F",
              freq: 0.45,
              abundance: 0.3,
            },
            {
              codon: "GGC",
              aa: "G",
              freq: 0.67,
              abundance: 0.5,
            },
            {
              codon: "CGA",
              aa: "R",
              freq: 0.23,
              abundance: 0.15,
            },
          ]}
      />
    </div>
  );
}

export default ChartGeneratorChat;
