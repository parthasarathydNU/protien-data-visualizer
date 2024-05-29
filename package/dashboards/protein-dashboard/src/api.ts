import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getAIResponse = async ( payload : any ) => {
  const response = await axios.post(`${API_URL}/query/`, payload);
  return response.data;
}

export const getFollowUpQuestions = async ( payload : any ) => {
  const response = await axios.post(`${API_URL}/query_followup/`, payload);
  return response.data;
}

export const fetchProteins = async () => {
  const response = await axios.get(`${API_URL}/proteins/`);
  return response.data;
};

export const fetchProteinCalculations = async (entry: string) => {
  const response = await axios.get(`${API_URL}/get_protein_data/${entry}`);
  return response.data;
};

export const fetchProtein = async (entry: string) => {
  const response = await axios.get(`${API_URL}/proteins/${entry}`);
  return response.data;
};

export const createProtein = async (protein: any) => {
  const response = await axios.post(`${API_URL}/proteins/`, protein);
  return response.data;
};

export const updateProtein = async (entry: string, protein: any) => {
  const response = await axios.put(`${API_URL}/proteins/${entry}`, protein);
  return response.data;
};

export const deleteProtein = async (entry: string) => {
  const response = await axios.delete(`${API_URL}/proteins/${entry}`);
  return response.data;
};
