import React from "react";
import axios from "axios";

export type Source = {
  name?: string;
  url?: string | null;
  source?: string;
  content?: string;
  metadata?: Record<string, any>;
};

export type Response = {
  data: {
    answer: string;
    sources: Source[];
    document_types: string[];
    suggestions: string[];
  };
};

export type ChatRole = "user" | "assistant";

export type Role = "Administrator" | "Manager" | "Analytics";

export type Message = {
  role: ChatRole;
  content: string;
  sources: Source[];
  fileType: string[];
  suggestion: string[];
  error: boolean;
};

interface UseChatOptions {
  apiUrl: string;
  role?: Role;
  errorMessage?: string;
}

export function useChat(options: UseChatOptions) {
  const { apiUrl, errorMessage = "Sorry, an error occurred" } = options;

  const [isLoading, setIsLoading] = React.useState(false);
  const [content, setContent] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const chatBoxRef = React.useRef<HTMLTextAreaElement>(null);
  const lastActivityRef = React.useRef<number>(Date.now());
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  // Function to generate a new session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Function to check if session should be reset
  const shouldResetSession = () => {
    const lastActivity = sessionStorage.getItem("chatbot_last_activity");
    if (!lastActivity) return true;
    
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
    return timeSinceLastActivity > SESSION_TIMEOUT;
  };
  
  // Generate or retrieve session ID with timeout check
  const [sessionId, setSessionId] = React.useState<string>(() => {
    const stored = sessionStorage.getItem("chatbot_session_id");
    
    // Check if we need to reset the session
    if (stored && !shouldResetSession()) {
      console.log("=== SESSION RESTORED ===");
      console.log("Existing Session ID:", stored);
      return stored;
    }
    
    // Generate new session if expired or doesn't exist
    const newId = generateSessionId();
    sessionStorage.setItem("chatbot_session_id", newId);
    sessionStorage.setItem("chatbot_last_activity", Date.now().toString());
    console.log("=== NEW SESSION CREATED ===");
    console.log("New Session ID:", newId);
    console.log(stored ? "Reason: Session expired (10+ minutes idle)" : "Reason: No existing session");
    return newId;
  });
  
  // Update last activity timestamp on mount and user interaction
  const updateLastActivity = React.useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    sessionStorage.setItem("chatbot_last_activity", now.toString());
  }, []);
  
  // Check for session timeout periodically
  React.useEffect(() => {
    updateLastActivity();
    
    const intervalId = setInterval(() => {
      if (shouldResetSession()) {
        console.log("=== SESSION EXPIRED ===");
        console.log("Old Session ID:", sessionId);
        console.log("Reason: 10 minutes of inactivity");
        
        // Generate new session
        const newId = generateSessionId();
        setSessionId(newId);
        sessionStorage.setItem("chatbot_session_id", newId);
        updateLastActivity();
        
        // Clear messages on session reset
        setMessages([]);
        
        console.log("New Session ID:", newId);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [sessionId, updateLastActivity]);
  
  // Detect page visibility changes (browser tab switching)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // When user returns to the tab, check if session expired
        if (shouldResetSession()) {
          console.log("=== SESSION EXPIRED (TAB RETURN) ===");
          console.log("Old Session ID:", sessionId);
          
          const newId = generateSessionId();
          setSessionId(newId);
          sessionStorage.setItem("chatbot_session_id", newId);
          updateLastActivity();
          setMessages([]);
          
          console.log("New Session ID:", newId);
        }
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [sessionId, updateLastActivity]);
  
  React.useEffect(() => {
    console.log("=== SESSION INITIALIZED ===");
    console.log("Session ID:", sessionId);
  }, [sessionId]);

  async function onSubmit(content: string) {
    if (!content.trim()) return;
    
    // Update last activity on every message
    updateLastActivity();

    const newMessage: Message = {
      role: "user",
      content,
      fileType: [],
      sources: [],
      suggestion: [],
      error: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setContent("");
    setIsLoading(true);

    try {
      console.log("=== API REQUEST ===");
      console.log("API URL:", apiUrl);
      console.log("Session ID:", sessionId);
      console.log("Request Payload:", {
        question: content,
        session_id: sessionId,
        use_memory: true,
        use_routing: true,
      });
      console.log("Current Conversation Memory (messages before request):", messages);
      console.log("Total messages in memory:", messages.length);
      
      const response = await axios.post(
        apiUrl,
        {
          question: content,
          session_id: sessionId,
          use_memory: true,
          use_routing: true,
        },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("=== API RESPONSE ===");
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
      console.log("Answer:", response.data.answer);
      console.log("Sources:", response.data.sources);
      console.log("Sources (stringified):", JSON.stringify(response.data.sources, null, 2));
      console.log("Document Types:", response.data.document_types);
      console.log("Suggestions:", response.data.suggestions);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources || [],
        fileType: response.data.document_types || [],
        suggestion: response.data.suggestions || [],
        error: false,
      };
      setMessages((prev) => {
        const updatedMessages = [...prev, assistantMessage];
        console.log("=== CONVERSATION MEMORY UPDATED ===");
        console.log("Total messages after update:", updatedMessages.length);
        console.log("Full conversation history:", updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error("=== API ERROR ===");
      console.error("Error fetching data:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error Response:", error.response?.data);
        console.error("Error Status:", error.response?.status);
        console.error("Error Headers:", error.response?.headers);
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          sources: [],
          fileType: [],
          suggestion: [],
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
    console.log("=== RESTARTING CHATBOT - CLEARING SESSION ===");
    console.log("Messages before clear:", messages.length);
    console.log("Old Session ID:", sessionId);
    
    // Generate new session ID when restarting chatbot
    const newId = generateSessionId();
    setSessionId(newId);
    sessionStorage.setItem("chatbot_session_id", newId);
    updateLastActivity();
    
    setMessages([]);
    console.log("✅ Chatbot restarted successfully");
    console.log("✅ New Session ID created:", newId);
    console.log("✅ Previous session cleared from frontend");
  };

  return {
    isLoading,
    content,
    messages,
    chatBoxRef,
    sessionId,
    setContent,
    onSubmit,
    clearMessages,
  };
}
