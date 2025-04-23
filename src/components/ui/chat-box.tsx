import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";

interface ChatBoxProps {
  content: string;
  setContent: (content: string) => void;
  onSubmit: (content: string) => void;
  isLoading: boolean;
  ref: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
}

export default function ChatBox({
  content,
  setContent,
  isLoading,
  onSubmit,
  className,
  ref,
}: ChatBoxProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(content);
          }
        }}
        autoFocus
        disabled={isLoading}
        className="field-sizing-content max-h-21 min-h-0 !resize-none px-4 py-3 text-[14px] leading-5 font-normal"
        placeholder="Ask me anything...."
        style={{
          resize: "none",
        }}
        ref={ref}
      />
      <Button
        size="icon"
        className="size-11 cursor-pointer rounded-lg"
        disabled={isLoading || !content.trim()}
        onClick={() => {
          onSubmit(content);
        }}
      >
        <Icons.gitHub className="size-6" />
      </Button>
    </div>
  );
}
