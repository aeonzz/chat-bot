import React from "react";
import axios from "axios";

export type Response = {
  data: {
    answer: string;
    sources: string[];
    document_types: string[];
  };
};

export type ChatRole = "user" | "assistant";

export type Role = "Administrator" | "Manager" | "Analytics";

export type Message = {
  role: ChatRole;
  content: string;
  sources: string[];
  fileType: string[];
  error: boolean;
};

interface UseChatOptions {
  apiUrl: string;
  role?: Role;
  errorMessage?: string;
}

export function useChat(options: UseChatOptions) {
  const { apiUrl, role, errorMessage = "Sorry, an error occurred" } = options;

  const [isLoading, setIsLoading] = React.useState(false);
  const [content, setContent] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const chatBoxRef = React.useRef<HTMLTextAreaElement>(null);

  async function onSubmit(content: string) {
    if (!content.trim()) return;

    const newMessage: Message = {
      role: "user",
      content,
      fileType: [],
      sources: [],
      error: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setContent("");
    setIsLoading(true);

    try {
      const response: Response = await axios.post(
        apiUrl,
        {
          question: content,
          role: role,
        },
        {
          method: "POST",
          headers: {},
        }
      );
      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources,
        fileType: response.data.document_types,
        error: false,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          sources: [],
          fileType: [],
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      chatBoxRef.current?.focus();
      setTimeout(() => {
        chatBoxRef.current?.focus();
      }, 10);
    }
  }

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    isLoading,
    content,
    messages,
    chatBoxRef,
    setContent,
    onSubmit,
    clearMessages,
  };
}
