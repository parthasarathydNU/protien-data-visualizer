import { apiRequest } from "./utils/apiUtils";
export enum MessageRolesEnum {
  assistant,
  human,
}
export enum MessageContentTypeEnum {
  chart="chart",
  conversation="conversation",
}

export type Message = {
  role: MessageRolesEnum;
  content: string;
  type: MessageContentTypeEnum;
};

export type AIRequestPayload = {
  query: string;
  context: Message[];
};

export type AIResponsePayload = {
  type: MessageContentTypeEnum,
  response: string;
}

export type FollowUpQuestionsResponse = {
  follow_up_questions: string[];
};

export type AIChartQueryRequest = AIRequestPayload & { table_name: string };

export type AIChatBotRequestTypes = AIRequestPayload | AIChartQueryRequest;

export type AIChatBotResponseTypes = AIResponsePayload;

export const getAIChartResponse = async (
  payload: AIChartQueryRequest
): Promise<AIResponsePayload> => {
  return apiRequest<any>({ method: "post", url: "query_chart", payload });
};

export const getAIResponse = async (payload: AIRequestPayload): Promise<AIResponsePayload> => {
  return apiRequest<any>({ method: "post", url: "query/", payload });
};

export const getFollowUpQuestions = async (
  payload: AIRequestPayload
): Promise<FollowUpQuestionsResponse> => {
  return apiRequest<any>({ method: "post", url: "query_followup/", payload });
};

export const fetchProteins = async () => {
  return apiRequest<any[]>({ method: "get", url: "proteins/" });
};

export const fetchProteinCalculations = async (entry: string) => {
  return apiRequest<any>({ method: "get", url: `get_protein_data/${entry}` });
};

export const fetchProtein = async (entry: string) => {
  return apiRequest<any>({ method: "get", url: `proteins/${entry}` });
};

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
