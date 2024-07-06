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

  export type ConversationMetadata = {
    title: string;
    id: string;
  }

  export type ConversationEntryData = {
    title: string;
    type: string;
    conversationHistory: Message[];
  }
