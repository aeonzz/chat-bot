import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bot, X } from "lucide-react";
import ChatBox from "@/components/ui/chat-box";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SuggestionBadge from "./_components/suggestion-badge";
import { useMediaQuery } from "@/hooks/use-media-query";

const topics = ["Code of Discipline", "DTR Violations", "Leave Filing"];

export default function PopupChat() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const matches = useMediaQuery("(min-width: 768px)");
  const { isLoading, content, messages, chatBoxRef, setContent, onSubmit } =
    useChat({
      apiUrl: import.meta.env.VITE_API_URL,
      errorMessage: "Sorry, something went wrong.",
    });

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  React.useEffect(() => {
    setTimeout(() => {
      setContent("");
    }, 400);
  }, [open, setContent]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "default", size: "icon" }),
          "fixed right-4 bottom-4 size-10 rounded-[99px] md:size-16",
          open && "opacity-0"
        )}
      >
        <Bot className="size-4 md:size-8" />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        className="flex h-[533px] w-[calc(100vw-0.7rem)] flex-col p-0 md:w-[429px]"
        side="left"
        sideOffset={matches ? -70 : -50}
      >
        <div className="bg-primary relative flex h-[48px] w-full items-center justify-between rounded-t-xl px-4 py-[12px]">
          {/* <img
            src={
              import.meta.env.PROD
                ? "./dist/papaz-handsup.svg"
                : "/papaz-handsup.svg"
            }
            alt="Papa Z Image"
            className="absolute -bottom-1.5 -left-5 size-[120px]"
          /> */}
          <h4 className="text-lg leading-[24px] font-semibold tracking-normal text-white">
            Papa Z’s here to help
          </h4>
          <Button
            variant="default"
            size="icon"
            className="size-6 rounded-md border-2 bg-transparent"
            onClick={() => setOpen((prev) => !prev)}
          >
            <X className="text-primary-foreground" />
          </Button>
        </div>
        {messages.length > 0 ? (
          <div className="mb-2 h-full w-full overflow-y-auto px-4 py-3">
            <div className="mx-auto mt-3 max-w-2xl">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "mb-5 flex",
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
                      {msg.role === "assistant" &&
                        msg.suggestion?.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              Suggestions
                            </p>
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
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2.5 text-center">
            <img
              src={
                import.meta.env.PROD
                  ? "./dist/papaz-holdingmic.svg"
                  : "/papaz-holdingmic.svg"
              }
              alt="Papa Z Image"
              className="size-[120px]"
            />
            <div>
              <h5 className="text-secondary-foreground text-[16px] leading-5 font-medium">
                Do you have some questions?
              </h5>
              <p className="text-sm leading-5">I can help you with that.</p>
            </div>
          </div>
        )}
        <div className="flex-1 px-3">
          {!messages.length && (
            <div className="w-max space-x-2.5 px-1 py-1 pb-4">
              {topics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  aria-disabled={isLoading}
                  className="hover:ring-ring cursor-pointer leading-5 font-normal hover:ring-1 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                  onClick={() => {
                    if (isLoading) return;
                    onSubmit(topic);
                  }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 pt-0">
          <ChatBox
            content={content}
            isLoading={isLoading}
            onSubmit={onSubmit}
            setContent={setContent}
            ref={chatBoxRef}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
