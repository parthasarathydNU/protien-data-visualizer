import React from 'react';
import { getAIResponse, getFollowUpQuestions } from '../api/api';
import ReusableChatBot from './reusableComponents/ReusableChatbot'; // Ensure this import path matches the location of your Chatbot component

const SQLChatBotView: React.FC = () => {
  return (
    <ReusableChatBot
      initialMessage="Welcome to the Protein Dashboard Chatbot! How can I assist you today?"
      followUpQuestionsInitial={[
        "How can you help me?",
        "What are the main protein families available in the database",
        "How can I find the average hydrophobicity of PF00063",
      ]}
      getAIResponse={getAIResponse}
      getFollowUpQuestions={getFollowUpQuestions}
    />
  );
};

export default SQLChatBotView;
