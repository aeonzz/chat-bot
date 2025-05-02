import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bot, ChevronDown, ExternalLink, X } from "lucide-react";
import ChatBox from "@/components/ui/chat-box";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import ChatDialog from "./_components/chat-dialog";
import ChatArea from "./_components/chat-area";
import { topics } from "./_config";

export default function PopupChat() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
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
    <>
      <ChatDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        openPopOver={setOpen}
        content={content}
        isLoading={isLoading}
        onSubmit={onSubmit}
        setContent={setContent}
        chatBoxRef={chatBoxRef}
        messages={messages}
        messagesEndRef={messagesEndRef}
      />
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
            <div className="flex items-center gap-0.5">
              <h4 className="text-lg leading-[24px] font-semibold tracking-normal text-white">
                Papa Z’s here to help
              </h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/40"
                  >
                    <ChevronDown className="size-5 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[118px] rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-foreground w-full hover:bg-[#E3E3E3]"
                    onClick={() => {
                      setOpenDialog(true);
                    }}
                  >
                    <ExternalLink />
                    Open in full
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
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
    </>
  );
}
