import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./Chatbot.css";
import LoadingSpinner from "../LoadingSpinner";
import AiResponseSkeleton from "../AiResponseSkeleton";
import { Fade } from "react-awesome-reveal";
import {
  AIChatBotRequestTypes,
  AIChatBotResponseTypes,
  AIRequestPayload,
  ConversationEntryData,
  ConversationMetadata,
  FollowUpQuestionsResponse,
  Message,
  MessageContentTypeEnum,
  MessageRolesEnum,
} from "../../api/types";
import VegaChart from "../dynamicCharts/VegaChart";
import { Button } from "@/components/ui/button";
import { ChartsData } from "../dynamicCharts/types";
import PreviousConversationsSheet from "./PreviousConversationsSheet";
import {
  createConversationEntry,
  usePreviousConversationsMetadata,
} from "api/api";
import { useQueryClient } from "@tanstack/react-query";
import FeedbackButtons from "./FeedbackButtons";



interface ReusableChatbotProps {
  initialMessage: string;
  followUpQuestionsInitial: string[];
  getAIResponse: (
    payload: AIChatBotRequestTypes
  ) => Promise<AIChatBotResponseTypes>;
  getFollowUpQuestions: (
    payload: AIRequestPayload
  ) => Promise<FollowUpQuestionsResponse>;
  chartData?: any;
  followUpQuestionsCount?: number;
  saveChart?: (chartData: ChartsData) => void;
  prevConversations: any[]
}

const ReusableChatBot: React.FC<ReusableChatbotProps> = ({
  initialMessage,
  followUpQuestionsInitial,
  getAIResponse,
  getFollowUpQuestions,
  chartData,
  followUpQuestionsCount = 3,
  saveChart,
  prevConversations
}) => {
  
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: MessageRolesEnum.assistant,
      content: initialMessage,
      type: MessageContentTypeEnum.conversation,
      queryId: "initial",
    },
  ]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>(
    followUpQuestionsInitial
  );

  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const pathName = window.location.pathname; // chatbot , explore

  useEffect(() => {
    return () => {
      console.log("unmounting");
      // Save only if there are more than three messages exchangeed between the user and the bot

      const payload: ConversationEntryData = {
        title: messages[0].content,
        type: pathName.substring(1) === "chatbot" ? "conversation" : "chart",
        conversationHistory: messages,
      };

      console.log("Sending payload to db ", payload);
      // trigger api call to create an entry to the conversations database
      createConversationEntry(payload);
      queryClient.invalidateQueries({
        queryKey: [`${pathName.substring(1)}-conversations`],
      });
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent, queryString?: string) => {
    e.preventDefault();
    if (loading || (!query && !queryString)) return;

    const currentQuery = query + "";

    setQuery("");

    setLoading(true);
    const userQuery = queryString || currentQuery;
    const newMessages = [
      ...messages,
      {
        role: MessageRolesEnum.human,
        content: userQuery,
        type: MessageContentTypeEnum.conversation,
      },
    ];
    setMessages(newMessages);

    const response = await getAIResponse({
      query: userQuery,
      context: messages,
    });
    setMessages([
      ...newMessages,
      {
        role: MessageRolesEnum.assistant,
        content: response.response,
        type: response.type,
        queryId: response.queryId,
      },
    ]);
    setLoading(false);
    askForFollowUp();
  };

  const askForFollowUp = async () => {
    const { follow_up_questions } = await getFollowUpQuestions({
      query,
      context: messages,
    });
    if (follow_up_questions) {
      setFollowUpQuestions(
        follow_up_questions.slice(0, followUpQuestionsCount)
      );
    }
  };

  const handleChipClick = (
    e: React.MouseEvent<HTMLDivElement>,
    chipQuestion: string
  ) => {
    console.log(chipQuestion);
    setQuery(chipQuestion);
    handleSubmit(e, chipQuestion);
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, index) => (
          <Fade key={index}>
            <div
              className={
                msg.role == MessageRolesEnum.human
                  ? "message user"
                  : "message bot"
              }
            >
              {msg.role == MessageRolesEnum.human ? (
                msg.content
              ) : msg.type == MessageContentTypeEnum.chart ? (
                <div className="flex justify-center flex-col">
                  <div
                    onClick={
                      saveChart
                        ? () =>
                            saveChart({
                              chart_data: chartData,
                              chart_spec: JSON.parse(msg.content),
                            })
                        : () => {}
                    }
                    className="flex"
                  >
                    <Button variant={"outline"}>Save Chart</Button>
                  </div>
                  <VegaChart data={chartData} spec={JSON.parse(msg.content)} />
                </div>
              ) : (
                <>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {msg.content}
                </Markdown>
                {msg.queryId !== 'initial' && (
    <FeedbackButtons queryId={msg.queryId!} response={msg.content} />
  )}

                </>
                
              )}
            </div>
          </Fade>
        ))}
        {loading && <AiResponseSkeleton />}
        <div ref={messageEndRef} />
      </div>
      <div
        className={`chips-container p-4 bg-transparent flex flex-wrap gap-2 justify-center ${
          loading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {followUpQuestions.map((question, index) => (
          <div
            key={index}
            className="chip border-blue-300 border px-8 py-2 rounded-full cursor-pointer hover:shadow-sm text-base"
            onClick={(e) => handleChipClick(e, question)}
          >
            {question}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            placeholder="Ask me anything..."
            className="input-field"
          />
          <button
            type="submit"
            className={`send-button flex w-36 justify-center ${
              !query.trim() && "disabled"
            }`}
            disabled={loading || !query.trim()}
          >
            {loading ? <LoadingSpinner /> : "Send"}
          </button>
        </div>
      </form>
      <div className=" absolute left-0 top-[50%] ">
        <PreviousConversationsSheet
          prevConverationData={
            prevConversations || ([] as ConversationMetadata[])
          }
          loadPrevConv={function (convId: string): void {
            console.log("method not implemented");
          }}
        />
      </div>
    </div>
  );
};

export default ReusableChatBot;
