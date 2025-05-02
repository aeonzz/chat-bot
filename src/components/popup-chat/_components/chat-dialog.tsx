import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ui/chat-box";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, Lightbulb, SquarePen } from "lucide-react";
import ChatArea from "./chat-area";
import { Message } from "@/hooks/use-chat";
import { topics } from "../_config";

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
  ...props
}: ChatDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className="h-[calc(100%_-_2rem)] w-[85%] bg-[#F0F1F4] p-3 sm:max-w-full [&_[data-slot=dialog-close]]:hidden">
        <div className="flex">
          <div className="h-full w-[218px] p-2 pl-0">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-[#ffffff]"
                onClick={() => {
                  openPopOver(true);
                  onOpenChange(false);
                }}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-[#ffffff]"
              >
                <SquarePen className="size-5" />
              </Button>
            </div>
            <div className="py-2 text-center">
              <h3 className="text-primary font-semibold">aSZistant AI</h3>
              <p className="text-muted-foreground text-sm font-medium">
                First AI Integration for SZ
              </p>
            </div>
            <div className="py-2">
              <p className="text-muted-foreground mb-2 text-[9px]">TODAY</p>
              {Array.from({ length: 4 }).map((_, index) => (
                <Button
                  key={index}
                  className="hover:text-foreground w-full justify-start px-1 hover:bg-[#E3E3E3]"
                  variant="ghost"
                >
                  Convo number {index + 1}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-[#ffffff] shadow-lg">
            <div className="w-full px-4 py-5">
              <h2 className="text-xl font-semibold">Papa Z’s here to help</h2>
            </div>
            <div className="h-[581px] mb-2">
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
                    {topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex h-[76px] w-32 flex-col justify-between rounded-lg border p-2 text-start"
                      >
                        <Lightbulb className="text-primary size-4" />
                        <p className="text-xs font-medium">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-3">
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
