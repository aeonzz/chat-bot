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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const topics = ["Code of Discipline", "DTR Violations", "Leave Filing"];

export default function PopupChat() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
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
          "fixed right-4 bottom-4 size-10 rounded-[99px]"
        )}
      >
        <Bot />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={20}
        className="flex h-[533px] w-[429px] flex-col p-0"
        side="left"
      >
        <div className="bg-primary relative flex h-[48px] w-full items-center justify-between rounded-t-xl px-4 py-[12px]">
          <img
            src={
              import.meta.env.PROD
                ? "./dist/papaz-handsup.svg"
                : "/papaz-handsup.svg"
            }
            alt="Papa Z Image"
            className="absolute -bottom-1.5 -left-5 size-[120px]"
          />
          <h4 className="text-4 ml-20 leading-[24px] font-semibold tracking-normal text-white">
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
                      "flex w-[320px] flex-col gap-3",
                      msg.role === "assistant" ? "items-start" : "items-end"
                    )}
                  >
                    <p
                      className={cn(
                        "w-fit rounded-lg px-3 py-2 text-[12px] font-medium tracking-normal",
                        msg.role === "assistant"
                          ? "bg-secondary text-foreground"
                          : "bg-accent text-accent-foreground",
                        msg.error &&
                          "border-destructive/30 bg-destructive/20 border"
                      )}
                    >
                      {msg.content}
                    </p>
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
          <ScrollArea className="flex w-full items-center gap-x-2.5">
            <div className="w-max space-x-2.5 px-1 py-1 pb-4">
              {topics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  aria-disabled={isLoading}
                  className="hover:ring-ring cursor-pointer leading-5 font-normal hover:ring-1 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                  onClick={() => {
                    if (isLoading) return;
                    setContent(topic);
                    onSubmit(topic);
                  }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
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
