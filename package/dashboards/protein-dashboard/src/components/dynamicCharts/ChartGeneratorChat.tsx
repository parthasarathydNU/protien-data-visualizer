import {
  getAIChartResponse, usePreviousConversationsMetadata,
} from "api/api";
import { AIChartQueryRequest, AIChatBotRequestTypes } from "api/types";
import ReusableChatBot from "components/reusableComponents/ReusableChatbot";
import { ChartsData } from "./types";

interface ChartGeneratorProps {
  saveChart: (chartsData: ChartsData) => void
}

const ChartGeneratorChat : React.FC<ChartGeneratorProps> = ({saveChart}) =>  {

  const pathName = window.location.pathname; // chatbot , explore

  const {
    data: prevConversations,
    isLoading,
    error,
  } = usePreviousConversationsMetadata(pathName);

  if (isLoading) {
    return <div>Loading History</div>;
  }

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
        prevConversations={prevConversations || []}
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
