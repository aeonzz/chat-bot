import React from "react";
import SuggestionBadge from "./suggestion-badge";
import SourceCard from "./source-card";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-chat";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (content: string) => void;
}

export default function ChatArea({
  messages,
  isLoading,
  messagesEndRef,
  onSubmit,
}: ChatAreaProps) {
  return (
    <div className="h-full w-full overflow-y-auto px-4 py-3">
      <div className="mx-auto max-w-4xl space-y-4 py-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex animate-in fade-in slide-in-from-bottom-2 duration-500",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-[85%] flex-col gap-3 md:max-w-[75%]",
                msg.role === "assistant" ? "items-start" : "items-end"
              )}
            >
              <div className="flex w-full flex-col space-y-2">
                <p
                  className={cn(
                    "w-fit rounded-lg px-4 py-2.5 text-sm font-medium leading-relaxed tracking-normal shadow-sm",
                    msg.role === "assistant"
                      ? "bg-secondary text-foreground"
                      : "bg-accent text-accent-foreground",
                    msg.error &&
                      "border-destructive/30 bg-destructive/20 border"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
                {msg.role === "assistant" && msg.sources.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium">Sources</p>
                    <div className="grid w-full grid-cols-2 gap-2">
                      {msg.sources.map((source, i) => (
                        <SourceCard key={i} source={source} />
                      ))}
                    </div>
                  </div>
                )}
                {msg.role === "assistant" && msg.suggestion?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestion.map((suggestion, index) => (
                        <SuggestionBadge
                          key={index}
                          suggestion={suggestion}
                          isLoading={isLoading}
                          onSubmit={() => onSubmit(suggestion)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-secondary rounded-lg px-4 py-3 shadow-sm">
              <div className="[&_div]:bg-primary flex items-center gap-1">
                <div className="size-2 animate-bounce rounded-full [animation-delay:0ms]" />
                <div className="size-2 animate-bounce rounded-full [animation-delay:150ms]" />
                <div className="size-2 animate-bounce rounded-full [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
