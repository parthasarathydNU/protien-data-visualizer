import React from 'react';
import { getAIResponse, getFollowUpQuestions, usePreviousConversationsMetadata } from '../api/api';
import ReusableChatBot from './reusableComponents/ReusableChatbot'; // Ensure this import path matches the location of your Chatbot component

const SQLChatBotView: React.FC = () => {

  const pathName = window.location.pathname; // chatbot , explore

  const {
    data: prevConversations,
    isLoading,
    error,
  } = usePreviousConversationsMetadata(pathName);

  if (isLoading) {
    return <div>Loading History</div>;
  }

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
      prevConversations={prevConversations || []}
    />
  );
};

export default SQLChatBotView;
