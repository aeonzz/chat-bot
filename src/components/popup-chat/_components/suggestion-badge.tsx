import { Badge } from "@/components/ui/badge";
import React from "react";

interface SuggestionBadgeProps extends React.ComponentProps<typeof Badge> {
  suggestion?: string;
  isLoading: boolean;
  onSubmit: () => void;
}

export default function SuggestionBadge({
  suggestion,
  isLoading,
  onSubmit,
  ...props
}: SuggestionBadgeProps) {
  return (
    <Badge
      variant="outline"
      aria-disabled={isLoading}
      className="hover:ring-ring cursor-pointer rounded-full py-1 leading-tight font-normal whitespace-normal hover:ring-1 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      onClick={() => {
        if (isLoading) return;
        onSubmit();
      }}
      {...props}
    >
      {suggestion}
    </Badge>
  );
}
