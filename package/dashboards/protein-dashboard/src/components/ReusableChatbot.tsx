import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./Chatbot.css";
import LoadingSpinner from "./LoadingSpinner";
import AiResponseSkeleton from "./AiResponseSkeleton";
import { Fade } from "react-awesome-reveal";
import {
  AIChatBotRequestTypes,
  AIChatBotResponseTypes,
  AIRequestPayload,
  FollowUpQuestionsResponse,
  Message,
  MessageContentTypeEnum,
  MessageRolesEnum,
} from "../api";
import VegaChart from "./dynamicCharts/VegaChart";

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
}

const ReusableChatBot: React.FC<ReusableChatbotProps> = ({
  initialMessage,
  followUpQuestionsInitial,
  getAIResponse,
  getFollowUpQuestions,
  chartData,
}) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: MessageRolesEnum.assistant, content: initialMessage, type: MessageContentTypeEnum.conversation },
  ]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>(
    followUpQuestionsInitial
  );
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

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
      { role: MessageRolesEnum.human, content: userQuery, type: MessageContentTypeEnum.conversation },
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
      setFollowUpQuestions(follow_up_questions);
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
                <div className="flex justify-center">
                  <VegaChart data={chartData} spec={JSON.parse(msg.content)} />
                </div>
              ) : (
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {msg.content}
                </Markdown>
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
    </div>
  );
};

export default ReusableChatBot;
