import React from "react";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ui/chat-box";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, Lightbulb, SquarePen } from "lucide-react";
import ChatArea from "./chat-area";
import { Message } from "@/hooks/use-chat";
import { useTopics } from "../_config";

interface ChatDialogProps
  extends Omit<React.ComponentProps<typeof Dialog>, "onOpenChange"> {
  openPopOver: (state: boolean) => void;
  onOpenChange: (open: boolean) => void;
  content: string;
  isLoading: boolean;
  onSubmit: (content: string) => void;
  setContent: (value: string) => void;
  chatBoxRef: React.RefObject<HTMLTextAreaElement | null>;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  clearMessages: () => void;
}

export default function ChatDialog({
  openPopOver,
  onOpenChange,
  content,
  isLoading,
  onSubmit,
  setContent,
  chatBoxRef,
  messages,
  messagesEndRef,
  clearMessages,
  ...props
}: ChatDialogProps) {
  const { topics, isLoading: topicsLoading } = useTopics();

  const handleNewChat = () => {
    if (messages.length > 0) {
      const confirmed = window.confirm(
        "Are you sure you want to start a new chat? This will clear your current conversation."
      );
      if (confirmed) {
        clearMessages();
      }
    }
  };

  // Keyboard shortcut: ESC to close dialog
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && props.open) {
        e.preventDefault();
        openPopOver(true);
        onOpenChange(false);
      }
    };

    if (props.open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.open, onOpenChange, openPopOver]);

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className="h-[calc(100%_-_2rem)] max-h-[900px] w-[90%] max-w-[1400px] bg-[#F0F1F4] p-3 sm:max-w-full [&_[data-slot=dialog-close]]:hidden">
        <div className="flex h-full gap-3">
          <div className="flex h-full w-[218px] flex-col p-2 pl-0">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-[#ffffff] hover:bg-accent/40"
                onClick={() => {
                  openPopOver(true);
                  onOpenChange(false);
                }}
                title="Back to popup"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-[#ffffff] hover:bg-accent/40"
                onClick={handleNewChat}
                disabled={isLoading}
                title="New chat"
              >
                <SquarePen className="size-5" />
              </Button>
            </div>
            <div className="flex-1 py-2">
              <div className="pb-4 text-center">
                <h3 className="text-primary font-semibold">aSZistant AI</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  First AI Integration for SZ
                </p>
              </div>
              {messages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground px-2 text-[9px] font-medium tracking-wide">
                    CURRENT SESSION
                  </p>
                  <div className="bg-accent/50 hover:bg-accent/70 rounded-lg border px-3 py-2 transition-colors">
                    <p className="text-foreground line-clamp-2 text-xs font-medium">
                      {messages[0]?.content || "Active conversation"}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px]">
                      {messages.length} message{messages.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-lg bg-[#ffffff] shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-2xl font-semibold tracking-tight">Papa Z's here to help</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Your AI assistant for all your queries
              </p>
            </div>
            <div className="mb-2 flex-1 overflow-hidden">
              {messages.length > 0 ? (
                <ChatArea
                  messages={messages}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                  onSubmit={onSubmit}
                />
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
                    <p className="text-sm leading-5">
                      I can help you with that.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-1 py-1">
                    {topicsLoading ? (
                      <div className="flex h-[76px] w-32 flex-col justify-between rounded-lg border p-2 text-start">
                        <Lightbulb className="text-primary size-4" />
                        <p className="text-xs font-medium">Loading...</p>
                      </div>
                    ) : (
                      topics.slice(0, 3).map((topic, index) => (
                        <div
                          key={index}
                          className="hover:bg-accent flex h-[76px] w-32 cursor-pointer flex-col justify-between rounded-lg border p-2 text-start transition-colors"
                          onClick={() => {
                            if (!isLoading) {
                              onSubmit(topic);
                            }
                          }}
                        >
                          <Lightbulb className="text-primary size-4" />
                          <p className="text-xs font-medium">{topic}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t px-4 py-3">
              <ChatBox
                content={content}
                isLoading={isLoading}
                onSubmit={onSubmit}
                setContent={setContent}
                ref={chatBoxRef}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
