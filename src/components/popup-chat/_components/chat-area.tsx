import React from "react";
import SuggestionBadge from "./suggestion-badge";
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
    <div className="mb-2 h-full w-full overflow-y-auto px-4 py-3">
      <div className="mx-auto mt-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-[320px] flex-col gap-3",
                msg.role === "assistant" ? "items-start" : "items-end"
              )}
            >
              <div className="flex flex-col space-y-1">
                <p
                  className={cn(
                    "w-fit rounded-lg px-3 py-2 text-[12px] font-medium tracking-normal",
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
                {msg.role === "assistant" && msg.suggestion?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Suggestions</p>
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
              {/* {msg.sources.length > 0 && (
                          <div className="grid w-full grid-cols-2 gap-2">
                            {msg.sources.map((source, i) => (
                              <SourceCard key={i} source={source} />
                            ))}
                          </div>
                        )} */}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="[&_div]:bg-primary flex items-center [&_div]:mx-0.5 [&_div]:size-1.5 [&_div]:rounded-full">
            <div className="animate-bounce delay-0" />
            <div className="animate-bounce delay-150" />
            <div className="animate-bounce delay-300" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
