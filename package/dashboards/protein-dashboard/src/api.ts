import { apiRequest } from "./utils/apiUtils";
export enum MessageRolesEnum {
  assistant,
human,
}
export type Message = { role: MessageRolesEnum; content: string };
export type AIRequestPayload = {
  query: string;
  context: Message[];
};

export type FollowUpQuestionsResponse = {
  follow_up_questions: string[]
}

export const getAIResponse = async (payload: AIRequestPayload) => {
  return apiRequest<any>({ method: "post", url: "query/", payload });
};

export const getFollowUpQuestions = async (payload: AIRequestPayload) : Promise<FollowUpQuestionsResponse> => {
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
