import { ChartsData } from "components/dynamicCharts/types";
import { apiRequest } from "../utils/apiUtils";
import { ProteinData } from "./apiDataTypes";
import { GetUseQuery } from "./hooks";
import {
  AIChartQueryRequest,
  AIResponsePayload,
  AIRequestPayload,
  FollowUpQuestionsResponse,
  ConversationMetadata,
  ConversationEntryData,
} from "./types";

export const getAIChartResponse = async (
  payload: AIChartQueryRequest
): Promise<AIResponsePayload> => {
  return apiRequest<any>({ method: "post", url: "query_chart", payload });
};

export const getAIResponse = async (
  payload: AIRequestPayload
): Promise<AIResponsePayload> => {
  return apiRequest<any>({ method: "post", url: "query/", payload });
};

export const getFollowUpQuestions = async (
  payload: AIRequestPayload
): Promise<FollowUpQuestionsResponse> => {
  return apiRequest<any>({ method: "post", url: "query_followup/", payload });
};

export const fetchProteins = () => {
  return GetUseQuery(
    ["proteins"],
    apiRequest<any[]>({ method: "get", url: "protein_data" })
  );
};

export const fetchSamples = (tableName: string) => {
  return GetUseQuery(
    [tableName],
    apiRequest<any[]>({ method: "get", url: `get_sample/${tableName}` })
  );
};

export const submitFeedback = async (payload: { queryId: string, response: string, isPositive: boolean }) => {
  return apiRequest<any>({ method: "post", url: "submit_feedback", payload });
};

// chart or conversation
// returns type ConversationMetadata[]
export const usePreviousConversationsMetadata = (type: string)  => {
  let option =  type.substring(1);
  if(option === "chatbot"){
    option = "conversation";
  } else {
    option = "chart";
  }
  return GetUseQuery(
    [`${type}-conversations`],
    apiRequest<ConversationMetadata[]>({ method: "get", url: `get_conversations/${option}` }),
    {
      staleTime: 60000
    }
  );
}

export const getPreviousConversations = (type: string) => {

  let option = type.substring(1);
  if(type === "chatbot"){
    option = "conversation";
  } else {
    option = "chart";
  }
  return apiRequest<ConversationMetadata[]>({ method: "get", url: `get_conversations/${option}` });

}

export const createConversationEntry = async (payload:ConversationEntryData) => {
  return apiRequest<any>({ method: "post", url: `create_conversation`, payload })
}

export const fetchProteinCalculations = async (entry: string) => {
  return apiRequest<any>({ method: "get", url: `get_protein_data/${entry}` });
};

export const fetchProtein = async (entry: string): Promise<ProteinData> => {
  return apiRequest<any>({ method: "get", url: `proteins/${entry}` });
};

export const saveChart = async ({ chart_data, chart_spec }: ChartsData) => {
  const payload = {
    chart_data: JSON.stringify(chart_data),
    chart_spec: JSON.stringify(chart_spec),
  };
  return apiRequest<any>({ method: "post", url: `create_chart`, payload });
};

export const fetchCharts =  () => {
  return apiRequest<any[]>({ method: "get", url: `get_sample/${"charts"}` })
}

export const createProtein = async (protein: any) => {
  return apiRequest<any>({
    method: "post",
    url: "proteins/",
    payload: protein,
  });
};

export const updateProtein = async (entry: string, protein: any) => {
  return apiRequest<any>({
    method: "put",
    url: `proteins/${entry}`,
    payload: protein,
  });
};

export const deleteProtein = async (entry: string) => {
  return apiRequest<any>({ method: "delete", url: `proteins/${entry}` });
};
