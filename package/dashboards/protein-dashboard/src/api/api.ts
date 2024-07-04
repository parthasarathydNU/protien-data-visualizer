import { apiRequest } from "../utils/apiUtils";
import { CodonUsage, ProteinData } from "./apiDataTypes";
import { AIChartQueryRequest, AIResponsePayload, AIRequestPayload, FollowUpQuestionsResponse } from "./types";


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

export const fetchProteins = async () : Promise<ProteinData[] | undefined> => {
  return apiRequest<any[]>({ method: "get", url: "get_sample/protein_data" });
};

export const fetchCodonUsage = async () : Promise<CodonUsage[] | undefined> => {
  return apiRequest<any[]>({method: "get", url: "get_sample/codon_usage" });
}

export const fetchSamples = async (tableName: string) => {
  return apiRequest<any[]>({method: "get", url: `get_sample/${tableName}` });
}

export const fetchProteinCalculations = async (entry: string) => {
  return apiRequest<any>({ method: "get", url: `get_protein_data/${entry}` });
};

export const fetchProtein = async (entry: string) : Promise<ProteinData> => {
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
